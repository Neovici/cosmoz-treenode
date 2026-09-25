import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.mdx',
		'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-links',
		'storybook-dark-mode',
	],
	framework: {
		name: '@storybook/web-components-vite',
		options: {},
	},
};

export default config;
