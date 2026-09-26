import type { Node, Tree } from '@neovici/cosmoz-tree';
import { component, css, html, useMemo } from '@pionjs/pion';
import { until } from 'lit-html/directives/until.js';

export const computePathToRender = (
	path?: Node[],
	hideFromRoot = 0,
	showMaxNodes = 0,
): Node[] | undefined => {
	if (!path) {
		return undefined;
	}

	let pathToRender = path;

	if (hideFromRoot > 0 && path.length > hideFromRoot) {
		pathToRender = path.slice(hideFromRoot);
	}

	if (showMaxNodes > 0 && pathToRender.length > showMaxNodes) {
		pathToRender = path.slice(-showMaxNodes);
	}

	return pathToRender;
};

/**
 * Walks the path array from the end until an undefined part is found
 * to make sure no unknown parts are present.
 * @param inputPath Array of path parts
 * @returns Array with defined parts
 */
export const getKnownPath = (inputPath?: Node[]): Node[] | undefined => {
	const path = inputPath;

	if (!Array.isArray(path) || path.length === 0) {
		return path;
	}

	for (let i = path.length - 1; i >= 0; i--) {
		if (path[i] === undefined) {
			path.splice(0, i + 1);

			if (path.length === 0) {
				return undefined;
			}

			break;
		}
	}

	return path;
};

export const computePath = async (
	ownerTree?: Tree,
	keyProperty?: string,
	keyValue?: string,
): Promise<Node[] | undefined> => {
	if (!ownerTree || keyProperty == null || keyValue === undefined) {
		return undefined;
	}

	if (keyProperty === 'pathLocator') {
		return getKnownPath((await ownerTree.getPathNodes(keyValue)) as Node[]);
	}

	const node = await ownerTree.getNodeByProperty(keyValue, keyProperty);

	return getKnownPath(
		node?.pathLocator
			? ((await ownerTree.getPathNodes(node.pathLocator)) as Node[])
			: undefined,
	);
};

interface PathTextParams {
	ownerTree: Tree;
	ellipsis: string;
	pathToRender?: Node[];
	path: Node[];
	valueProperty: string;
	pathSeparator: string;
}

export const computePathText = async ({
	ownerTree,
	ellipsis,
	pathToRender,
	path,
	valueProperty,
	pathSeparator,
}: PathTextParams): Promise<string> => {
	if (!pathToRender) {
		return '';
	}

	const stringParts = await Promise.all(
		pathToRender.map((node) => ownerTree.getProperty(node, valueProperty)),
	);

	let text = stringParts.join(pathSeparator);

	if (pathToRender.length < path.length) {
		text = ellipsis + text;
	}

	return text;
};

const style = css`
	:host {
		display: block;
	}

	:host([no-wrap]) {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		direction: rtl;
	}
	/* Safari only css fix */
	@media not all and (min-resolution: 0.001dpcm) {
		@supports (-webkit-appearance: none) {
			:host span {
				display: inline-block;
			}
		}
	}
`;

interface TreeNodeProps {
	searchProperty?: string;
	pathStringSeparator?: string;
	hideFromRoot?: number;
	showMaxNodes?: number;
	keyProperty?: string;
	keyValue?: string;
	ownerTree?: Tree;
	ellipsis?: string;
	fallback?: string;
}

export const Treenode = ({
	searchProperty = 'name',
	pathStringSeparator = ' / ',
	hideFromRoot = 0,
	showMaxNodes = 0,
	keyProperty,
	keyValue,
	ownerTree,
	ellipsis = '… / ',
	fallback,
}: TreeNodeProps) => {
	const path$ = useMemo(
		() => computePath(ownerTree, keyProperty, keyValue),
		[ownerTree, keyProperty, keyValue],
	);

	const text$ = useMemo(async () => {
		const path = await path$;

		if (!path) {
			return fallback || '';
		}

		return computePathText({
			ownerTree,
			ellipsis,
			path,
			pathToRender: computePathToRender(path, hideFromRoot, showMaxNodes),
			valueProperty: searchProperty,
			pathSeparator: pathStringSeparator,
		} as PathTextParams);
	}, [
		path$,
		ownerTree,
		ellipsis,
		hideFromRoot,
		showMaxNodes,
		searchProperty,
		pathStringSeparator,
		fallback,
	]);

	const title$ = useMemo(async () => {
		const path = await path$;

		if (!path) {
			return fallback || '';
		}

		return computePathText({
			ownerTree,
			ellipsis,
			path,
			pathToRender: path,
			valueProperty: searchProperty,
			pathSeparator: pathStringSeparator,
		} as PathTextParams);
	}, [
		path$,
		ownerTree,
		ellipsis,
		searchProperty,
		pathStringSeparator,
		fallback,
	]);

	return html`
		<span title=${until(title$, fallback)}>&lrm;${until(text$, fallback)}</span>
	`;
};

/**
 * `cosmoz-treenode` is a component to display a node in a `cosmoz-tree` data structure
 * @customElement
 * @demo demo/index.html
 */
customElements.define(
	'cosmoz-treenode',
	component(Treenode, {
		styleSheets: [style],
		observedAttributes: [
			'key-property',
			'key-value',
			'search-property',
			'path-string-separator',
			'hide-from-root',
			'show-max-nodes',
			'fallback',
			'ellipsis',
		],
	}),
);
