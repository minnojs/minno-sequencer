import angular from 'angular';
import templateFilter from './templateFilter';
import templateObjProvider from './templateObjProvider';

export default module;

var module = angular.module('template', []);

module.filter('template', templateFilter);
module.service('templateObj', templateObjProvider);
module.constant('templateDefaultContext',{});
