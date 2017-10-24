// The example build for reference
// https://github.com/requirejs/r.js/blob/master/build/example.build.js
({
    // Creates a dist folder with optimized js
    logLevel: 2, // WARN
    baseUrl: '../src',
    removeCombined: true,
    preserveLicenseComments: false,
    optimize: 'none',
    exclude: ['underscore'],

    paths: {
        underscore: 'empty:'
    },

    onModuleBundleComplete: function (data) {
        var fs = module.require('fs');
        var amdclean = module.require('amdclean');
        var outputFile = data.path;
        var cleanedCode = amdclean.clean({
            transformAMDChecks: false,
            filePath: outputFile,
            aggressiveOptimizations: true,
            'removeAllRequires': false,
            ignoreModules: ['lodash', 'lodash_compat'], 
            wrap: {
                start: `;(function(root, factory){
                            // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, and plain browser loading
                            if (typeof define === 'function' && define.amd) {
                                factory.amd = true;
                                define(['underscore'], function(_) { return factory(_); });
                            } else if (typeof exports !== 'undefined') {
                                factory.commonjs = true;
                                module.exports = factory(require('lodash-compat'), root);
                            } else {
                                root.Database = factory(root._, root);
                            }
                        }(this, function factory(underscore) {`,
                end: `return index;
                    }));`
            },
        });

        fs.writeFileSync(outputFile, cleanedCode);
    },

    name: 'index',
    out: '../minno-sequencer.js'
});
