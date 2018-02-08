import _ from 'lodash';
var global = window.piGlobal;

import mixerSequence from './mixer/main';
import templateObj from './template/main';
import collectionProvider from './collection/collectionProvider';
import randomizerProvider from './randomizer/randomizerProvider';

import storeProvider from './store/storeProvider';
import databaseSequenceProvider from './databaseSequenceProvider';
import databaseProvider from './databaseProvider';
import queryProvider from './queryProvider';
import inflateProvider from './inflateProvider';

import piConsoleFactory from './console/piConsole';
export default Database;

var piConsole = piConsoleFactory(console);
var collection = collectionProvider();

var DatabaseRandomizer = randomizerProvider(
    randomInt,// randomize int
    randomArr,// randomize range
    collection
);

var databaseQuery = queryProvider(
    collection,
    piConsole
);

var databaseInflate = inflateProvider(
    databaseQuery,
    {global: global}, // rootscope
    piConsole
);

var DatabaseStore = storeProvider(
    collection
);

var databaseSequence = databaseSequenceProvider(
    mixerSequence
);

var Database = databaseProvider(
    DatabaseStore,
    DatabaseRandomizer,
    databaseInflate,
    templateObj,
    databaseSequence,
    piConsole
);

function randomArr(length){
    return _.shuffle(_.range(length));
}

function randomInt(length){
    return Math.floor(Math.random()*length);
}
