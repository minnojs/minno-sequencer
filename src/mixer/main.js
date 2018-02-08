import _ from 'lodash';

import Mixer from './mixer';
import mixerDotNotationProvider from './branching/mixerDotNotationProvider';
import mixerConditionProvider from './branching/mixerConditionProvider';
import mixerEvaluateProvider from './branching/mixerEvaluateProvider';
import mixerBranchingDecorator from './branching/mixerBranchingDecorator';
import mixerSequenceProvider from './mixerSequenceProvider';
import dotNotation from './branching/dotNotation'; // this is a value, doesn't need to be evaluated
import piConsoleFactory from '../console/piConsole';

export default MixerSequence;

var piConsole = piConsoleFactory(console);
var mixer = Mixer(
    _.shuffle, // randomizeShuffle
    Math.random // randomizeRandom
);

var mixerDotNotation = mixerDotNotationProvider(dotNotation);
var mixerCondition = mixerConditionProvider(
    mixerDotNotation,
    piConsole
);

var mixerEvaluate = mixerEvaluateProvider(mixerCondition);

var mixerDefaultContext = {};

mixerBranchingDecorator(
    mixer,
    mixerEvaluate,
    mixerDefaultContext
);

var MixerSequence = mixerSequenceProvider(mixer);
