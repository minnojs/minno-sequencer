var file;
var allTestFiles = [];
var TEST_REGEXP = /^\/base\/src.*_test\.js$/; // base/src is needed to exclude bower_components

var pathToModule = function(path) {
    //return path.replace(/^\/base\//, '').replace(/\.js$/, '');
    return path.replace(/^\/base\/src\/js\/|\.js$/g,'');
};

// We can't use Object.keys because IE8
for(file in window.__karma__.files){
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        //var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
        allTestFiles.push(pathToModule(file));
    }
}

/* global requirejs */
requirejs.config({
    waitSeconds: 0,
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
        underscore: '../vendor/lodash',
        angular: '../vendor/angular',
        angularMocks: '../vendor/angular-mocks'
    },

    shim: {
        angular : {'exports' : 'angular'},
        angularMocks : {deps: ['angular'], exports: 'angular'}
    },

    // ask Require.js to load these files (all our tests)
    deps: ['angular', 'angularMocks'].concat(allTestFiles), 

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
