import sequencer from './databaseNoAngular';
import {mixerDefaultContext} from './mixer/main';
import {templateDefaultContext} from './template/main';
import mixerRecursive from './mixer/mixerRecursive';
sequencer.mixerRecursive = mixerRecursive;
sequencer.mixerDefaultContext = mixerDefaultContext;
sequencer.templateDefaultContext = templateDefaultContext;
export default sequencer;
