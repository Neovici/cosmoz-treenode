import esbuild from 'rollup-plugin-esbuild';

import rollupPluginCommonjs from '@rollup/plugin-commonjs';
import rollupPluginInjectProcessEnv from 'rollup-plugin-inject-process-env';
import rollupPluginJson from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';

/** @type { import('@web/storybook-framework-web-components').StorybookConfig } */
const config = {
	stories: ['../stories/**/*.stories.{js,ts,mdx}'],
	staticDirs: ['../demo'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
	docs: {
		//👇 See the table below for the list of supported options
		autodocs: 'tag',
	},
	framework: {
		name: '@web/storybook-framework-web-components',
	},
	/* Try to make the build parse TS files */
	async rollupFinal(config) {
		// add extra configuration for rollup
		// e.g. a new plugin
		config.plugins.push(esbuild({}));
		config.plugins.push(
			alias({
				entries: [{ find: 'assert', replacement: 'browser-assert' }],
			}),
		);
		config.plugins.push(rollupPluginJson());
		config.plugins.push(rollupPluginCommonjs());
		config.plugins.push(rollupPluginInjectProcessEnv(process?.env));

		return config;
	},
};

export default config;
