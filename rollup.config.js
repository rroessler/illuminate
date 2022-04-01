/// Node Modules
import typescript from '@rollup/plugin-typescript';

/// Rollup Configuration.
export default [{
    input: 'src/lib/illuminate.ts',
    output: [{
        file: 'dist/illuminate.mjs',
        format: 'es'
    }, {
        file: 'dist/illuminate.umd.js',
        name: 'illuminate',
        format: 'umd'
    }],
    plugins: [typescript()]
}, {
    input: 'src/lib/bundle.ts',
    output: {
        file: 'dist/illuminate.js',
        format: 'cjs'
    },
    plugins: [typescript()]
}]