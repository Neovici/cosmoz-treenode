/* eslint-disable no-console */
/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma'),
	merge = require('deepmerge'),
	baseCustomLaunchers = {
		FirefoxHeadless: {
			base: 'Firefox',
			flags: ['-headless']
		}
	},
	sauceCustomLaunchers = {
		slAndroid: {
			base: 'SauceLabs',
			browserName: 'chrome',
			browserVersion: 'beta',
			platformName: 'Windows 10'
		},
		slEdge: {
			base: 'SauceLabs',
			browserName: 'MicrosoftEdge',
			browserVersion: '18.17763',
			platformName: 'Windows 10'
		},
		slSafari: {
			base: 'SauceLabs',
			browserName: 'safari',
			browserVersion: '12.0',
			platformName: 'macOS 10.14'
		}
	},
	allCustomLaunchers = { ...baseCustomLaunchers, ...sauceCustomLaunchers};

module.exports = config => {

	const useSauce = process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY,
		customLaunchers = useSauce ? allCustomLaunchers : baseCustomLaunchers;

	if (!useSauce) {
		console.warn('Missing SAUCE_USERNAME/SAUCE_ACCESS_KEY, skipping sauce.');
	}

	config.set(
		merge(createDefaultConfig(config), {
			customLaunchers,
			browsers: Object.keys(customLaunchers),
			files: [
				// runs all files ending with .test in the test folder,
				// can be overwritten by passing a --grep flag. examples:
				//
				// npm run test -- --grep test/foo/bar.test.js
				// npm run test -- --grep test/bar/*
				{ pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }
			],

			esm: {
				nodeResolve: true
			},
			client: {
				mocha: {
					ui: 'tdd'
				}
			},
			sauceLabs: {
				testName: 'Web App Unit Tests'
			},
			reporters: ['dots', 'saucelabs'],
			singleRun: true
			// you can overwrite/extend the config further
		}),
	);
	return config;
};
