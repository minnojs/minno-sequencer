import sequencer from './databaseNoAngular';
import {mixerDefaultContext, mixerRecursive} from './mixer/main';
import {templateDefaultContext} from './template/main';
sequencer.mixerRecursive = mixerRecursive;
sequencer.mixerDefaultContext = mixerDefaultContext;
sequencer.templateDefaultContext = templateDefaultContext;
export default sequencer;
