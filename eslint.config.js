import neoviciConfig from '@neovici/cfg/eslint/index.mjs';

const ignores = {
	ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
};

const customRules = {
	rules: {
		'max-lines-per-function': 0,
		'import/group-exports': 0,
	},
};

export default [ignores, ...neoviciConfig, customRules];
