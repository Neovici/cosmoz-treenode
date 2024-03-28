import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import '../src/cosmoz-treenode';
import { TreeData, Tree } from '@neovici/cosmoz-tree/cosmoz-tree.js';

export interface TreeNodeTemplateArgs {
	keyProperty: string;
	keyValue: string;
	valueProperty: string;
	pathSeparator: string;
	hideFromRoot: boolean;
	showMaxNodes: number;
	fallback: string;
}

const TreeNodeTemplate = (
	{
		keyProperty,
		keyValue,
		valueProperty,
		pathSeparator,
		hideFromRoot,
		showMaxNodes,
		fallback,
	}: TreeNodeTemplateArgs,
	{
		loaded: { treeJson },
	}: {
		loaded: {
			treeJson: TreeData;
		};
	},
) => {
	const ownerTree = new Tree(treeJson);

	return html`
		<cosmoz-treenode
			.keyProperty=${keyProperty}
			.keyValue=${keyValue}
			.valueProperty=${valueProperty}
			.pathSeparator=${pathSeparator}
			.hideFromRoot=${hideFromRoot}
			.showMaxNodes=${showMaxNodes}
			.fallback=${fallback}
			.ownerTree=${ownerTree}
		></cosmoz-treenode>
	`;
};

const meta: Meta = {
	title: 'Treenode',
	render: TreeNodeTemplate,
	tags: ['autodocs'],
	argTypes: {
		keyProperty: { control: 'text', description: '' },
		keyValue: { control: 'text', description: '' },
		valueProperty: { control: 'text', description: '' },
		pathSeparator: { control: 'text', description: '' },
		hideFromRoot: { control: 'boolean', description: '' },
		showMaxNodes: { control: 'number', description: '' },
		fallback: { control: 'text', description: '' },
		noWrap: { control: 'boolean', description: '' },
	},
	parameters: {
		docs: {
			controls: {
				exclude: [],
			},
			description: {
				component: 'The Cosmoz Treenode web component',
			},
		},
	},
	// This is how you fetch json files
	loaders: [
		async () => ({
			treeJson: await (await fetch('../demo/tree.json')).json(),
		}),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CompanyKtwoktqtxv: Story = {
	args: {
		pathSeparator: '#',
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
	},
	parameters: {
		docs: {
			description: {
				story: 'Display node: Company Ktwoktqtxv',
			},
		},
	},
};

export const CompanyDjpahhofjp: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
	},
	parameters: {
		docs: {
			description: {
				story: 'Display node: Company Djpahhofjp',
			},
		},
	},
};

export const CompanyDjpahhofjpHidingThreeNodes: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		hideFromRoot: 3,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Display node: Company Djpahhofjp and hiding the first 3 nodes from root',
			},
		},
	},
};

export const CompanyKtwoktqtxvWithTwoNodes: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
		showMaxNodes: 2,
	},
	parameters: {
		docs: {
			description: {
				story: 'Display node: Company Ktwoktqtxv and showing only two nodes',
			},
		},
	},
};

export const AlternateSeparator: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		pathSeparator: '##',
	},
	parameters: {
		docs: {
			description: {
				story: 'Alternate separator',
			},
		},
	},
};

export const KtwoktqtxvWithNoWrap: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'f7a21733-0e65-4985-9e40-a4fb00f3124f',
		noWrap: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Display node: Company Ktwoktqtxv with no-wrap',
			},
		},
	},
};

export const AlternateTemplateWithChildren: Story = {
	args: {
		keyProperty: 'id',
		keyValue: 'fc78989a-d213-496c-80db-a4fb00f31252',
		children: html`<template>
			<span style="color: red;" class="separator separator[[index]]"> $$ </span>
			<a href="#id=[[node.id]]">[[node.name]]</a>
		</template>`,
	},
	parameters: {
		docs: {
			description: {
				story: 'Alternate variant with template child',
			},
		},
	},
};
