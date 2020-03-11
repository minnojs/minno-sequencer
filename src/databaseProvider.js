import _ from 'lodash';
export default DatabaseProvider;

DatabaseProvider.$inject = ['DatabaseStore', 'DatabaseRandomizer', 'databaseInflate', 'templateObj', 'databaseSequence','piConsole'];
function DatabaseProvider(Store, Randomizer, inflate, templateObj, DatabaseSequence, piConsole){

    function Database(){
        this.store = new Store();
        this.randomizer = new Randomizer();
    }

    _.extend(Database.prototype, {
        createColl: function(namespace){
            this.store.create(namespace);
        },

        getColl: function(namespace){
            return this.store.read(namespace);
        },

        add: function(namespace, query){
            var coll = this.store.read(namespace);
            coll.add(query);
        },

        inflate: function(namespace, query, context, options){
            var coll = this.getColl(namespace);
            var result;

            // inherit
            try {
                if (!query.$inflated || query.reinflate) {
                    query.$inflated = inflate(query, coll, this.randomizer);
                    query.$templated = null; // we have to retemplate after querying, who know what new templates we got here...
                }
            } catch(err) {
                piConsole({
                    type:'error',
                    message: 'Failed to inherit',
                    error:err,
                    context: query
                });
                if (this.onError) this.onError(err);
                throw err;
            }

            // template
            try {
                if (!query.$templated || query.$inflated.regenerateTemplate){
                    context[namespace + 'Meta'] = query.$meta;
                    context[namespace + 'Data'] = templateObj(query.$inflated.data || {}, context, options); // make sure we support
                    query.$templated = templateObj(query.$inflated, context, options);
                }
            } catch(err) {
                piConsole({
                    type:'error',
                    message: 'Failed to apply template',
                    error:err,
                    context: query.$inflated
                });
                if (this.onError) this.onError(err);
                throw err;
            }

            result = query.$templated;

            // set flags
            if (context.global && result.addGlobal) _.extend(context.global, result.addGlobal);

            if (context.current && result.addCurrent) _.extend(context.current, result.addCurrent);

            return result;
        },

        sequence: function(namespace, arr){
            if (!_.isArray(arr)){
                throw new Error('Sequence must be an array.');
            }
            return new DatabaseSequence(namespace, arr, this);
        }
    });

    return Database;
}
