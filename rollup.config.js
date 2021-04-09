import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';

const dev = process.env.ROLLUP_WATCH;

// bundle workers
export default [...['compiler', 'bundler'].map(x => ({
	input: `src/workers/${x}/index.js`,
	output: {
		file: `workers/${x}.js`,
		format: 'iife'
	},
	plugins: [
		resolve(),
		json(),
		!dev && terser()
	]
})),
{
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'esm',
		name: 'app',
		dir: 'build'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: dev
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		dev && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		dev && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		!dev && terser()
	],
	watch: {
		clearScreen: false
	}
}		
];
