import type { Preview } from '@storybook/web-components';

const preview: Preview = {
	tags: ['autodocs'],
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/iu,
				date: /Date$/iu,
			},
		},
	},
};

export default preview;
