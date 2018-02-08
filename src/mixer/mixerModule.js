import angular from 'angular';
import randomizeModule from '../randomize/randomizeModule';
import consoleModule from '../console/consoleModule';

import mixer from './mixer';
import mixerSequential from './mixerSequential';
import mixerRecursive from './mixerRecursive';
import mixerSequenceProvider from './mixerSequenceProvider';

import dotNotation from './branching/dotNotation';
import mixerDotNotationProvider from './branching/mixerDotNotationProvider';
import mixerConditionProvider from './branching/mixerConditionProvider';
import mixerBranchingDecorator from './branching/mixerBranchingDecorator';
import mixerEvaluateProvider from './branching/mixerEvaluateProvider';

export default module;

var module = angular.module('mixer',[
    randomizeModule.name,
    consoleModule.name
]);

module.service('mixer', mixer);
module.service('mixerSequential', mixerSequential); // is this even in use?
module.service('mixerRecursive', mixerRecursive); // is this even in use?
module.service('MixerSequence', mixerSequenceProvider);

module.value('dotNotation', dotNotation);
module.service('mixerDotNotation', mixerDotNotationProvider);
module.service('mixerCondition', mixerConditionProvider);
module.service('mixerEvaluate', mixerEvaluateProvider);
module.config(['$provide', function($provide){
    $provide.decorator('mixer', mixerBranchingDecorator);
}]);
module.constant('mixerDefaultContext', {});
