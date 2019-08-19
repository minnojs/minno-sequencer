import _ from 'lodash';
export default templateObjProvider;

templateObjProvider.$inject = ['templateDefaultContext'];
function templateObjProvider(templateDefaultContext){

    function templateObj(obj, context, options){
        var skip = _.get(options, 'skip', []);
        var ctx = _.assign({}, context, templateDefaultContext);

        return _.cloneDeep(obj, customizer);

        function customizer(value, key, object){
            if (obj === object && _.includes(skip, key)) return value;
            if (_.isString(value) && _.includes(value, '<%')) return _.template(value)(ctx);
        }
    }

    return templateObj;
}
