/*
 * inflates an object
 * this function is responsible for inheritance
 *
 * function inflate(source,coll, randomizer, recursive, counter)
 * @param source: the object to inflate
 * @param coll: a collection to inherit from
 * @param randomizer: a randomizer object for the query
 * @param recursive: private use only, is this inside the recursion (true) or top level (false)
 * @param depth: private use only, a counter for the depth of the recursion
 */
import _ from 'lodash';
export default inflateProvider;

inflateProvider.$inject = ['databaseQuery','$rootScope'];
function inflateProvider(query, $rootScope){

    function customize(source){
        // check for a custom function and run it if it exists
        if (_.isFunction(source.customize)){
            source.customize.apply(source, [source, $rootScope.global]);
        }
        return source;
    }

    // @param source - object to inflate
    // @param type - trial stimulus or media
    // @param recursive - whether this is a recursive call or not
    function inflate(source, coll, randomizer, recursive, depth){

        // protection against infinte loops
        // ***********************************
        depth = recursive ? --depth : 10;

        if (!depth) throw new Error('Inheritance loop too deep, you can only inherit up to 10 levels down');

        if (!_.isPlainObject(source)) throw new Error('You are trying to inflate a non object (' + JSON.stringify(source) + ')');

        var parent;
        var child = _.cloneDeep(source);
        var inheritObj = child.inherit;

        /*
         * no inheritance
         */

        if (!child.inherit) {
            if (!recursive) customize(child); // customize only on the last call (non recursive)
            return child;
        }

        /*
         * get parent
         */
        parent = query(inheritObj, coll, randomizer);

        // if inherit target was not found
        if (!parent) throw new Error('Query failed, object (' + JSON.stringify(inheritObj) +	') not found.');

        // inflate parent (recursively)
        parent = inflate(
            parent,
            coll,
            randomizer,
            true,
            depth
        );

        // extending the child
        // ***********************************
        if (inheritObj.merge && !_.isArray(inheritObj.merge)){
            throw new Error('Inheritance error: inherit.merge must be an array.');
        }

        // start inflating child (we have to extend selectively...)
        _.each(parent, function(value, key){
            var childProp, parentProp;
            // if this key is not set yet, copy it out of the parent
            if (!(key in child)){
                child[key] = _.isFunction(value) ? value : _.cloneDeep(value);
                return;
            }

            // if we have a merge array,
            if (_.indexOf(inheritObj.merge, key) != -1){
                childProp = child[key];
                parentProp = value;

                if (_.isArray(childProp)){
                    if (!_.isArray(parentProp)){
                        throw new Error('Inheritance error: You tried merging an array with an non array (for "' + key + '")');
                    }
                    child[key] = childProp.concat(parentProp);
                }

                if (_.isPlainObject(childProp)){
                    if (!_.isPlainObject(parentProp)){
                        throw new Error('Inheritance error: You tried merging an object with an non object (for "' + key + '")');
                    }
                    child[key] = _.extend({},parentProp,childProp);
                }
            }
        });

        // we want to extend the childs data even if it already exists
        // its ok to shallow extend here (because by definition parent was created for this inflation)
        if (parent.data){
            child.data = _.extend(parent.data, child.data || {});
        }

        // Personal customization functions - only if this is the last iteration of inflate
        // This way the customize function gets called only once.
        !recursive && customize(child);

        // return inflated trial
        return child;
    }

    return inflate;
}
