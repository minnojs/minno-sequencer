export default module;

import angular from 'angular';
import mixerModule from './mixer/mixerModule';
import templateModule from './template/templateModule';
import piConsole from './piConsole';
import randomizerProvider from './randomizer/randomizerProvider';
import collectionProvider from './collection/collectionProvider';
import inflateProvider from './inflateProvider';
import queryProvider from './queryProvider';
import databaseProvider from './databaseProvider';
import storeProvider from './store/storeProvider';
import databaseSequenceProvider from './databaseSequenceProvider';

var consoleModule =  angular.module('piConsole',[]);
consoleModule.factory('piConsole', piConsole);

var module = angular.module('database',[
    mixerModule.name,
    templateModule.name,
    consoleModule.name
])
    .service('Collection', collectionProvider)
    .service('DatabaseRandomizer', randomizerProvider)
    .service('databaseQuery', queryProvider)
    .service('databaseInflate', inflateProvider)
    .service('DatabaseStore', storeProvider)
    .service('Database', databaseProvider)
    .service('databaseSequence', databaseSequenceProvider);
