/* eslint-disable max-statements */
import { DefaultTree } from '@neovici/cosmoz-tree/cosmoz-default-tree';
import { treeData } from './data/tree-data';
import '../src';

const defaultTree = new DefaultTree(treeData);

export default {
	title: 'Components/CosmozTreenode',
	component: 'cosmoz-treenode',
	tags: ['autodocs'],
	argTypes: {
		keyProperty: { control: 'text', description: 'The property to use as key' },
		keyValue: { control: 'text', description: 'The value to look up' },
		searchProperty: {
			control: 'text',
			description: 'The property to display (default: name)',
		},
		pathStringSeparator: {
			control: 'text',
			description: 'Separator between path parts (default: " / ")',
		},
		hideFromRoot: {
			control: 'number',
			description: 'Number of nodes to hide from the root',
		},
		showMaxNodes: {
			control: 'number',
			description: 'Maximum number of nodes to show',
		},
		ellipsis: {
			control: 'text',
			description: 'Ellipsis to show when path is shortened',
		},
		fallback: {
			control: 'text',
			description: 'Text to show when path cannot be found',
		},
		noWrap: { control: 'boolean', description: 'No text wrapping' },
	},
};

const Template = (args) => {
	const el = document.createElement('cosmoz-treenode');

	if (args.keyProperty) {
		el.setAttribute('key-property', args.keyProperty);
	}
	if (args.keyValue) {
		el.setAttribute('key-value', args.keyValue);
	}
	if (args.searchProperty) {
		el.setAttribute('search-property', args.searchProperty);
	}
	if (args.pathStringSeparator) {
		el.setAttribute('path-string-separator', args.pathStringSeparator);
	}
	if (args.hideFromRoot) {
		el.setAttribute('hide-from-root', args.hideFromRoot);
	}
	if (args.showMaxNodes) {
		el.setAttribute('show-max-nodes', args.showMaxNodes);
	}
	if (args.ellipsis) {
		el.setAttribute('ellipsis', args.ellipsis);
	}
	if (args.fallback) {
		el.setAttribute('fallback', args.fallback);
	}
	if (args.noWrap) {
		el.setAttribute('no-wrap', '');
	}

	(el as HTMLElement & { ownerTree?: DefaultTree }).ownerTree = defaultTree;

	return el;
};

export const DisplayNodeYamahaNippon = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
		searchProperty: 'name',
		pathStringSeparator: ' / ',
	},
};

export const DisplayNodeMitsubishiHeavyIndustries = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		searchProperty: 'name',
	},
};

export const HideFromRoot = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		hideFromRoot: 2,
	},
};

export const ShowMaxNodes = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
		showMaxNodes: 2,
	},
};

export const AlternateSeparator = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		pathStringSeparator: '##',
	},
};

export const NoWrap = {
	render: Template,
	args: {
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
		noWrap: true,
	},
};
