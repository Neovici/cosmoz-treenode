import { component, html } from '@pionjs/pion';
import { Tree, Node } from '@neovici/cosmoz-tree/cosmoz-tree';
import { Component } from '@pionjs/pion/lib/component';

export type Props = {
	valueProperty: string;
	pathSeparator: string;
	hideFromRoot: number;
	showMaxNodes: number;
	keyProperty: string;
	keyValue: string;
	ownerTree: Tree;
	ellipsis: string;
	fallback: string;
};

export interface ComputePathText
	extends Pick<
		Props,
		'ownerTree' | 'ellipsis' | 'valueProperty' | 'pathSeparator'
	> {
	pathToRender?: (Node | undefined)[];
	path: (Node | undefined)[];
}

export const computePathToRender = <T extends string | Node | undefined>(
		path?: T[],
		hideFromRoot?: number,
		showMaxNodes?: number,
	) => {
		if (!path) {
			return;
		}
		let pathToRender = path;
		if (hideFromRoot! > 0 && path.length > hideFromRoot!) {
			pathToRender = path.slice(hideFromRoot);
		}

		if (showMaxNodes! > 0 && pathToRender.length > showMaxNodes!) {
			pathToRender = path.slice(-showMaxNodes!);
		}
		return pathToRender;
	},
	/**
	 * Walks the path array from the end until an undefined part is found
	 * to make sure no unknown parts are present.
	 * @param {Array} inputPath Array of path parts
	 * @returns {Array} Array with defined parts
	 */
	getKnownPath = <T>(inputPath: T[] | null) => {
		let path: T[] | null = inputPath;
		if (!Array.isArray(path) || path.length === 0) {
			return path;
		}
		for (let i = path.length - 1; i >= 0; i--) {
			if (path[i] === undefined) {
				path.splice(0, i + 1);
				if (path.length === 0) {
					path = null;
				}
				break;
			}
		}
		return path;
	},
	computePath = (ownerTree?: Tree, keyProperty?: string, keyValue?: string) => {
		// HACK(pasleq): Cosmoz.Tree API needs to be fixed to avoid such code in components
		let path: (Node | undefined)[] | null = null;

		if (!ownerTree || keyProperty == null || keyValue === undefined) {
			return;
		}

		if (keyProperty === 'pathLocator') {
			path = ownerTree.getPathNodes(keyValue);
		} else {
			const node = ownerTree.getNodeByProperty(keyValue, keyProperty);
			if (node && node.pathLocator) {
				path = ownerTree.getPathNodes(node.pathLocator);
			}
		}

		return getKnownPath(path);
	},
	computePathText = ({
		ownerTree,
		ellipsis,
		pathToRender,
		path,
		valueProperty,
		pathSeparator,
	}: ComputePathText) => {
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
	},
	render = ({ title, text }: { title: string; text: string }) => html`
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
	`,
	Treenode = ({
		valueProperty = 'name',
		pathSeparator = ' / ',
		hideFromRoot = 0,
		showMaxNodes = 0,
		keyProperty,
		keyValue,
		ownerTree,
		ellipsis = '… / ',
		fallback,
	}: Props) => {
		const path = computePath(ownerTree, keyProperty, keyValue);
		if (!path) return render({ text: fallback, title: fallback });
		const pathToRender = computePathToRender(path, hideFromRoot, showMaxNodes),
			opts = {
				ownerTree,
				ellipsis,
				path,
				valueProperty,
				pathSeparator,
			};
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

export type TreenodeComponent = Component<Props>;

/**
 * `cosmoz-treenode` is a component to display a node in a `cosmoz-tree` data structure
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
customElements.define(
	'cosmoz-treenode',
	component(Treenode, {
		observedAttributes: [
			'key-property',
			'key-value',
			'value-property',
			'path-separator',
			'hide-from-root',
			'show-max-nodes',
			'fallback',
		],
	}),
);