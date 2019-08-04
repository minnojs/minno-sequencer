import sequencer from './databaseNoAngular';
import {mixerDefaultContext} from './mixer/main';
import {templateDefaultContext} from './template/main';
sequencer.mixerDefaultContext = mixerDefaultContext;
sequencer.templateDefaultContext = templateDefaultContext;
export default sequencer;
