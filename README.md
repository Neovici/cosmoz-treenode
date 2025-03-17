# \<cosmoz-treenode\>

[![Build Status](https://github.com/Neovici/cosmoz-treenode/workflows/Github%20CI/badge.svg)](https://github.com/Neovici/cosmoz-treenode/actions?workflow=Github+CI)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A web component to display a node in a tree data structure. Written in TypeScript using PionJS.

## Features

- Display a path to a node in a tree structure
- Control display options like maximum nodes to show
- Hide parts of the path from the root
- Customizable separator between path parts
- Fallback text when a path cannot be found

## Installation

```bash
npm install @neovici/cosmoz-treenode
```

## Usage

```html
<cosmoz-treenode
	key-property="pathLocator"
	key-value="1.2.3.301"
	value-property="name"
	path-separator=" / "
	hide-from-root="0"
	show-max-nodes="0"
	fallback="Not found"
></cosmoz-treenode>
```

## Scripts

- `npm start` - Starts Storybook development server at port 8000
- `npm run build` - Builds the TypeScript source files
- `npm run build:watch` - Watches and builds TypeScript files
- `npm test` - Runs tests with coverage
- `npm run test:watch` - Runs tests in watch mode
- `npm run storybook:build` - Builds Storybook for production
- `npm run storybook:preview` - Builds and previews Storybook

## Development

This component is written in TypeScript. The source files are in the `src/` directory.

### Development workflow

1. Clone the repository
2. Install dependencies: `npm ci`
3. Start Storybook: `npm start`

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## License

Apache-2.0
