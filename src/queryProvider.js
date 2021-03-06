import _ from 'lodash';
export default queryProvider;

queryProvider.$inject = ['Collection'];
function queryProvider(Collection){

    function queryFn(query, collection, randomizer){
        var coll = collection instanceof Collection ? collection.collection : collection; // get array

        // shortcuts:
        // ****************************

        if (_.isFunction(query)) return query(collection);

        if (_.isString(query) || _.isNumber(query)) query = {set:query, type:'random'};

        // filter by set
        // ****************************
        if (query.set) coll = _.filter(coll,{set:query.set});

        // filter by data
        // ****************************
        if (_.isString(query.data)) coll = coll.filter(function(q){
            return q.handle === query.data || (q.data && q.data.handle === query.data);
        });

        if (_.isPlainObject(query.data)) coll = _.filter(coll, {data:query.data});

        if (_.isFunction(query.data)) coll = _.filter(coll, query.data);

        if (query.n) coll = repeatArr(query.n, coll);

        // pick by type
        // ****************************

        // the default seed is namespace specific just to minimize the situations where seeds clash across namespaces
        var seed = query.seed || ('$' + collection.namespace + query.set);
        var length = coll.length;
        var repeat = query.repeat;
        var at;

        switch (query.type){
            case undefined:
            case 'byData':
            case 'random':
                at = randomizer.random(length,seed,repeat);
                break;
            case 'equalDistribution':
                if (!query.seed) throw new Error('"equalDistribution" requires you to set an explicit "seed" (' + JSON.stringify(query) +	')');
                // falls through
            case 'exRandom':
                at = randomizer.exRandom(length,seed,repeat);
                break;
            case 'sequential':
                at = randomizer.sequential(length,seed,repeat);
                break;
            case 'at':
                at = _.isUndefined(query.at) ? 0 : query.at - 1;
                break;
            case 'first':
                at = 0;
                break;
            case 'last':
                at = length-1;
                break;
            default:
                throw new Error('Unknow query type: ' + query.type);
        }

        if (_.isUndefined(coll[at])) throw new Error('Query failed, object (' + JSON.stringify(query) +	') not found. If you are trying to apply a template, you should know that they are not supported for inheritance.');

        return coll[at];
    }

    return queryFn;

    function repeatArr(n, arr){
        var res = [];
        while (res.length <= n) res = res.concat(arr);
        res.length = n;
        return res;
    }
}
