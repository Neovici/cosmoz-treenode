import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { Tree } from '@neovici/cosmoz-tree/cosmoz-tree';
import {
	computePath,
	computePathToRender,
	TreenodeComponent,
} from '../src/cosmoz-treenode';

const treeBaseUrl = '/node_modules/@neovici/cosmoz-tree/test/data',
	basicTreeUrl = `${treeBaseUrl}/basicTree.json`,
	multiRootTreeUrl = `${treeBaseUrl}/multiRootTree.json`,
	missingAncestorTreeUrl = `${treeBaseUrl}/missingAncestorTree.json`,
	treeFromJsonUrl = async (url: string) => {
		const json = await fetch(url).then((r) => r.json());
		return new Tree(json);
	};

suite('basic', () => {
	let basicFixture: TreenodeComponent, basicTree: Tree;

	suiteSetup(async () => {
		basicTree = await treeFromJsonUrl(basicTreeUrl);
	});

	setup(async () => {
		basicFixture = await fixture<TreenodeComponent>(html`
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

	test('computePath', () => {
		expect(computePath()).to.equal(undefined);
		expect(
			computePath(basicTree, 'id', '11111111-1111-1111-1111-111111111111'),
		).deep.equal(basicTree.getPathNodes('1'));
		expect(
			computePath(basicTree, 'id', '3a7654f1-e3e6-49c7-b6a8-a4fb00f31245'),
		).deep.equal(basicTree.getPathNodes('1.2.3'));
		expect(
			computePath(new Tree({}), 'id', '11111111-1111-1111-1111-111111111111'),
		).to.equal(null);
	});

	test('computePathToRender', () => {
		expect(computePathToRender()).to.equal(undefined);
		expect(computePathToRender(['a', 'b', 'c', 'd'], 2)).deep.equal(['c', 'd']);
		expect(computePathToRender(['a', 'b', 'c', 'd'], 1)).deep.equal([
			'b',
			'c',
			'd',
		]);
		expect(computePathToRender(['a', 'b', 'c', 'd'], 1, 1)).deep.equal(['d']);
	});

	test('renders path', async () => {
		await elementUpdated(basicFixture); // Firefox fails without this one
		const textContent =
			basicFixture.shadowRoot!.querySelector('span')!.textContent;
		expect(textContent).to.include(
			['Root', 'Node2', 'Node3', 'Node301'].join(' / '),
		);
	});

	test('uses pathSeparator', async () => {
		const customSep = '#';
		basicFixture.pathSeparator = customSep;
		await elementUpdated(basicFixture);
		const textContent =
			basicFixture.shadowRoot!.querySelector('span')!.textContent;
		expect(textContent).to.include(
			['Root', 'Node2', 'Node3', 'Node301'].join(customSep),
		);
	});
});

suite('lookupNodeById', () => {
	let basicFixture: TreenodeComponent, basicTree: Tree;

	suiteSetup(async () => {
		basicTree = await treeFromJsonUrl(basicTreeUrl);
	});

	setup(async () => {
		basicFixture = await fixture(html`
			<cosmoz-treenode
				key-property="id"
				key-value="3a7654f1-e3e6-49c7-b6a8-a4fb00f31245"
			></cosmoz-treenode>
		`);
		basicFixture.ownerTree = basicTree;
	});

	test('renders path', async () => {
		await elementUpdated(basicFixture); // Firefox fails without this one
		const textContent =
			basicFixture.shadowRoot!.querySelector('span')!.textContent;
		expect(textContent).to.include(['Root', 'Node2', 'Node3'].join(' / '));
	});
});

suite('multiRoot', () => {
	let multiRootFixture: TreenodeComponent, multiRootTree: Tree;

	suiteSetup(async () => {
		multiRootTree = await treeFromJsonUrl(multiRootTreeUrl);
	});

	setup(async () => {
		multiRootFixture = await fixture(html`
			<cosmoz-treenode
				key-property="pathLocator"
				key-value="1.2.3"
			></cosmoz-treenode>
		`);
		multiRootFixture.ownerTree = multiRootTree;
	});

	test('renders path', async () => {
		await elementUpdated(multiRootFixture); // Firefox fails without this one
		const textContent =
			multiRootFixture.shadowRoot!.querySelector('span')!.textContent;
		expect(textContent).to.include(['Node2', 'Node3'].join(' / '));
	});
});

suite('missingAncestor', () => {
	let missingAncestorFixture: TreenodeComponent, missingAncestorTree: Tree;

	suiteSetup(async () => {
		missingAncestorTree = await treeFromJsonUrl(missingAncestorTreeUrl);
	});

	setup(async () => {
		missingAncestorFixture = await fixture(html`
			<cosmoz-treenode
				key-property="pathLocator"
				key-value="1.2.3.301.401"
			></cosmoz-treenode>
		`);
		missingAncestorFixture.ownerTree = missingAncestorTree;
	});

	test('renders all path parts', async () => {
		await elementUpdated(missingAncestorFixture); // Firefox fails without this one
		const textContent =
			missingAncestorFixture.shadowRoot!.querySelector('span')!.textContent;
		expect(textContent).is.include(['Node301', 'Node401'].join(' / '));
	});
});
