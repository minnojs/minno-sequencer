/* eslint env:"node" */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = false && !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.js',
    output: {
        file: 'minno-sequencer.js',
        format: 'umd', 
        name: 'minno-sequencer',
        sourcemap: true
    },
    plugins: [
        resolve(),
        commonjs(),
        production && uglify() // minify, but only in production
    ],
    external:['lodash'],
    globals: {
        lodash: '_'
    }
};
