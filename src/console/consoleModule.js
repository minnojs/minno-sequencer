import piConsole from './piConsole';
export default consoleModule;

var consoleModule = angular.module('piConsole',[]);
consoleModule.factory('piConsole', piConsole);
