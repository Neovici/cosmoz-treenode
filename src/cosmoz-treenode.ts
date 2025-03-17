import { component, html } from '@pionjs/pion';
import type { Tree, Node } from '@neovici/cosmoz-tree';

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

export const computePath = (
	ownerTree?: Tree,
	keyProperty?: string,
	keyValue?: string,
): Node[] | undefined => {
	if (!ownerTree || keyProperty == null || keyValue === undefined) {
		return undefined;
	}

	if (keyProperty === 'pathLocator') {
		return getKnownPath(ownerTree.getPathNodes(keyValue) as Node[]);
	}

	const node = ownerTree.getNodeByProperty(keyValue, keyProperty);

	return getKnownPath(
		node?.pathLocator
			? (ownerTree.getPathNodes(node.pathLocator) as Node[])
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

export const computePathText = ({
	ownerTree,
	ellipsis,
	pathToRender,
	path,
	valueProperty,
	pathSeparator,
}: PathTextParams): string => {
	if (!pathToRender) {
		return '';
	}

	const stringParts = pathToRender.map((node) =>
		ownerTree.getProperty(node, valueProperty),
	);

	let text = stringParts.join(pathSeparator);

	if (pathToRender.length < path.length) {
		text = ellipsis + text;
	}

	return text;
};

interface RenderParams {
	title: string;
	text: string;
}

export const render = ({ title, text }: RenderParams) => html`
	<style>
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
	</style>
	<span title=${title}>&lrm;${text}</span>
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
	const path = computePath(ownerTree, keyProperty, keyValue);

	if (!path) {
		return render({ text: fallback || '', title: fallback || '' });
	}

	const pathToRender = computePathToRender(path, hideFromRoot, showMaxNodes);
	const opts = {
		ownerTree,
		ellipsis,
		path,
		valueProperty: searchProperty,
		pathSeparator: pathStringSeparator,
	} as PathTextParams;
	return render({
		text: computePathText({
			...opts,
			pathToRender,
		}),
		title: computePathText({
			...opts,
			pathToRender: path,
		}),
	});
};

/**
 * `cosmoz-treenode` is a component to display a node in a `cosmoz-tree` data structure
 * @customElement
 * @demo demo/index.html
 */
customElements.define(
	'cosmoz-treenode',
	component(Treenode, {
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
