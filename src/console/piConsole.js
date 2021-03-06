import _ from 'lodash';

export default piConsoleFactory;

piConsoleFactory.$inject = ['$log'];
function piConsoleFactory($log){
    return window.DEBUG ? piConsole : _.noop;

    function piConsole(log){
        if (_.get(piConsole,'settings.hideConsole', false)) return window.postMessage({type:'kill-console'},'*');

        $log[log.type] && $log[log.type](log.message); 
        window.postMessage(noramlizeMessage(log),'*');
    }

    function noramlizeMessage(obj){
        return _.cloneDeepWith(obj, normalize);
        function normalize(val){
            if (_.isFunction(val)) return val.toString();
            if (_.isError(val)) return {name:val.name, message:val.message, stack:val.stack};
        }
    }
}
