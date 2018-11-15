/**
 * Registers the branching mixers with the mixer
 * @return {function}         [mixer decorator]
 */

import _ from 'lodash';

export default mixerBranchingDecorator;

mixerBranchingDecorator.$inject = ['$delegate','mixerEvaluate','mixerDefaultContext','piConsole'];
function mixerBranchingDecorator(mix, evaluate, mixerDefaultContext, piConsole){

    mix.mixers.branch = branch;
    mix.mixers.multiBranch = multiBranch;

    return mix;

    /**
     * Branching mixer
     * @return {Array}         [A data array with objects to continue with]
     */
    function branch(obj, context){
        context = _.extend(context || {}, mixerDefaultContext);
        if (_.isUndefined(obj.conditions)) {
            piConsole({
                type:'error',
                message: 'Missing conditions in branch mixer.',
                context: obj
            });
            throw new Error('Missing conditions in branch mixer.');
        }
        return evaluate(obj.conditions, context) ? obj.data || [] : obj.elseData || [];
    }

    /**
     * multiBranch mixer
     * @return {Array}         [A data array with objects to continue with]
     */
    function multiBranch(obj, context){
        context = _.extend(context || {}, mixerDefaultContext);
        var row;

        row = _.find(obj.branches, function(branch){
            if (_.isUndefined(branch.conditions)) {
                piConsole({
                    type:'error',
                    message: 'Missing conditions in multi branch mixer.',
                    context: branch
                });
                throw new Error('Missing conditions in multi branch mixer.');
            }
            return evaluate(branch.conditions, context);
        });

        if (row) {
            return row.data || [];
        }

        return obj.elseData || [];
    }
}
