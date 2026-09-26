import type { Node, Tree } from '@neovici/cosmoz-tree';
import { DefaultTree } from '@neovici/cosmoz-tree/cosmoz-default-tree';
import {
	elementUpdated,
	expect,
	fixture,
	html,
	nextFrame,
} from '@open-wc/testing';
import { computePath, computePathToRender } from '../src';

interface CosmozTreenode extends HTMLElement {
	ownerTree?: Tree;
	keyProperty?: string;
	keyValue?: string;
	pathStringSeparator?: string;
	searchProperty?: string;
	hideFromRoot?: number;
	showMaxNodes?: number;
	ellipsis?: string;
	fallback?: string;
}

const treeBaseUrl = '/node_modules/@neovici/cosmoz-tree/test/data';
const basicTreeUrl = `${treeBaseUrl}/basicTree.json`;
const multiRootTreeUrl = `${treeBaseUrl}/multiRootTree.json`;
const missingAncestorTreeUrl = `${treeBaseUrl}/missingAncestorTree.json`;
const treeFromJsonUrl = async (url: string): Promise<DefaultTree> => {
	const json = await fetch(url).then((r) => r.json());
	return new DefaultTree(json);
};

suite('cosmoz-treenode', () => {
	suite('basic', () => {
		let basicFixture: CosmozTreenode;
		let basicTree: DefaultTree;

		suiteSetup(async () => {
			basicTree = await treeFromJsonUrl(basicTreeUrl);
		});

		setup(async () => {
			basicFixture = await fixture<CosmozTreenode>(html`
				<cosmoz-treenode
					key-property="pathLocator"
					key-value="1.2.3.301"
				></cosmoz-treenode>
			`);
			basicFixture.ownerTree = basicTree;
		});

		test('instantiating the element works', () => {
			expect(basicFixture.tagName).to.equal('COSMOZ-TREENODE');
		});

		test('computePath', async () => {
			expect(await computePath()).to.equal(undefined);
			expect(
				await computePath(
					basicTree,
					'id',
					'11111111-1111-1111-1111-111111111111',
				),
			).deep.equal(await basicTree.getPathNodes('1'));
			expect(
				await computePath(
					basicTree,
					'id',
					'3a7654f1-e3e6-49c7-b6a8-a4fb00f31245',
				),
			).deep.equal(await basicTree.getPathNodes('1.2.3'));
			expect(
				await computePath(
					new DefaultTree({}),
					'id',
					'11111111-1111-1111-1111-111111111111',
				),
			).to.equal(undefined);
		});

		test('computePathToRender', () => {
			expect(computePathToRender()).to.equal(undefined);
			expect(
				computePathToRender(['a', 'b', 'c', 'd'] as unknown as Node[], 2),
			).deep.equal(['c', 'd']);
			expect(
				computePathToRender(['a', 'b', 'c', 'd'] as unknown as Node[], 1),
			).deep.equal(['b', 'c', 'd']);
			expect(
				computePathToRender(['a', 'b', 'c', 'd'] as unknown as Node[], 1, 1),
			).deep.equal(['d']);
		});

		test('renders path', async () => {
			await elementUpdated(basicFixture);
			const textContent =
				basicFixture.shadowRoot?.querySelector('span')?.textContent;
			expect(textContent).to.include(
				['Root', 'Node2', 'Node3', 'Node301'].join(' / '),
			);
		});

		test('renders path as title', async () => {
			await elementUpdated(basicFixture);
			expect(
				basicFixture.shadowRoot?.querySelector('span')?.getAttribute('title'),
			).to.equal(['Root', 'Node2', 'Node3', 'Node301'].join(' / '));
		});

		test('uses pathStringSeparator', async () => {
			const customSep = '#';
			basicFixture.pathStringSeparator = customSep;
			await elementUpdated(basicFixture);
			const textContent =
				basicFixture.shadowRoot?.querySelector('span')?.textContent;
			expect(textContent).to.include(
				['Root', 'Node2', 'Node3', 'Node301'].join(customSep),
			);
		});

		test('renders fallback while the path is pending', async () => {
			basicFixture.fallback = 'Not found';
			basicFixture.keyValue = '1.2.4';
			await elementUpdated(basicFixture);
			expect(
				basicFixture.shadowRoot?.querySelector('span')?.textContent,
			).to.include('Not found');
		});

		test('renders fallback when the key value is not set', async () => {
			basicFixture.fallback = 'Not found';
			basicFixture.keyValue = undefined;
			await elementUpdated(basicFixture);
			expect(
				basicFixture.shadowRoot?.querySelector('span')?.textContent,
			).to.include('Not found');
		});

		test('swaps the fallback for the resolved path', async () => {
			basicFixture.fallback = 'Not found';
			basicFixture.keyValue = undefined;
			await elementUpdated(basicFixture);
			expect(
				basicFixture.shadowRoot?.querySelector('span')?.textContent,
			).to.include('Not found');

			basicFixture.keyValue = '1.2.3.301';
			await elementUpdated(basicFixture);
			await nextFrame();
			expect(
				basicFixture.shadowRoot?.querySelector('span')?.textContent,
			).to.include(['Root', 'Node2', 'Node3', 'Node301'].join(' / '));
		});
	});

	suite('pending', () => {
		let fixtureElement: CosmozTreenode;

		const deferredTree = (): Tree => {
			const tree = new DefaultTree({});
			let release: () => void;
			const gate = new Promise<void>((resolve) => {
				release = resolve;
			});
			tree.getPathNodes = (async (pathLocator = '') => {
				await gate;
				return [
					{ id: 'root', name: 'Root', pathLocator: '1' },
					{ id: 'leaf', name: 'Leaf', pathLocator },
				] as Node[];
			}) as Tree['getPathNodes'];
			return Object.assign(tree, { release: () => release() });
		};

		setup(async () => {
			fixtureElement = await fixture<CosmozTreenode>(html`
				<cosmoz-treenode
					fallback="…"
					key-property="pathLocator"
					key-value="1.2.3"
				></cosmoz-treenode>
			`);
			fixtureElement.ownerTree = deferredTree();
		});

		test('renders fallback until the path resolves', async () => {
			await elementUpdated(fixtureElement);
			await nextFrame();
			expect(
				fixtureElement.shadowRoot?.querySelector('span')?.textContent,
			).to.include('…');

			(fixtureElement.ownerTree as Tree & { release: () => void }).release();
			await nextFrame();
			await nextFrame();
			expect(
				fixtureElement.shadowRoot?.querySelector('span')?.textContent,
			).to.include(['Root', 'Leaf'].join(' / '));
		});
	});

	suite('lookupNodeById', () => {
		let basicFixture: CosmozTreenode;
		let basicTree: DefaultTree;

		suiteSetup(async () => {
			basicTree = await treeFromJsonUrl(basicTreeUrl);
		});

		setup(async () => {
			basicFixture = await fixture<CosmozTreenode>(html`
				<cosmoz-treenode
					key-property="id"
					key-value="3a7654f1-e3e6-49c7-b6a8-a4fb00f31245"
				></cosmoz-treenode>
			`);
			basicFixture.ownerTree = basicTree;
		});

		test('renders path', async () => {
			await elementUpdated(basicFixture);
			const textContent =
				basicFixture.shadowRoot?.querySelector('span')?.textContent;
			expect(textContent).to.include(['Root', 'Node2', 'Node3'].join(' / '));
		});
	});

	suite('multiRoot', () => {
		let multiRootFixture: CosmozTreenode;
		let multiRootTree: DefaultTree;

		suiteSetup(async () => {
			multiRootTree = await treeFromJsonUrl(multiRootTreeUrl);
		});

		setup(async () => {
			multiRootFixture = await fixture<CosmozTreenode>(html`
				<cosmoz-treenode
					key-property="pathLocator"
					key-value="1.2.3"
				></cosmoz-treenode>
			`);
			multiRootFixture.ownerTree = multiRootTree;
		});

		test('renders path', async () => {
			await elementUpdated(multiRootFixture);
			const textContent =
				multiRootFixture.shadowRoot?.querySelector('span')?.textContent;
			expect(textContent).to.include(['Node2', 'Node3'].join(' / '));
		});
	});

	suite('missingAncestor', () => {
		let missingAncestorFixture: CosmozTreenode;
		let missingAncestorTree: DefaultTree;

		suiteSetup(async () => {
			missingAncestorTree = await treeFromJsonUrl(missingAncestorTreeUrl);
		});

		setup(async () => {
			missingAncestorFixture = await fixture<CosmozTreenode>(html`
				<cosmoz-treenode
					key-property="pathLocator"
					key-value="1.2.3.301.401"
				></cosmoz-treenode>
			`);
			missingAncestorFixture.ownerTree = missingAncestorTree;
		});

		test('renders all path parts', async () => {
			await elementUpdated(missingAncestorFixture);
			const textContent =
				missingAncestorFixture.shadowRoot?.querySelector('span')?.textContent;
			expect(textContent).is.include(['Node301', 'Node401'].join(' / '));
		});
	});
});
