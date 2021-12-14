import { Tree } from '@neovici/cosmoz-tree';

import {
	ComputingLitElement, html
} from '@neovici/computing-lit-element';

/**
 * `cosmoz-treenode` is a component to display a node in a `cosmoz-tree` data structure
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
class CosmozTreenode extends ComputingLitElement {
	render() {
		return html`
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
				@media not all and (min-resolution:.001dpcm) { @supports (-webkit-appearance:none) {
					:host span { display: inline-block;}
				}}
			</style>
			<span title="${ this._pathText }">&lrm;${ this._pathText }</span>
		`;
	}

	static get properties() {
		return {

			/**
			* Name of the property used to lookup the displayed node in the tree
			*/
			keyProperty: {
				attribute: 'key-property',
				type: String
			},

			/**
			* The value for the `keyProperty` used to lookup the node in the tree.
			*/
			keyValue: {
				attribute: 'key-value',
				type: String
			},

			ownerTree: {
				type: Tree
			},

			valueProperty: {
				attribute: 'value-property',
				type: String
			},

			pathSeparator: {
				attribute: 'path-separator',
				type: String
			},

			/**
			* Represent a number of nodes that should not be rendered starting from root.
			* If the path to the displayed node has less nodes than this number, then nothing is hidden.
			*/
			hideFromRoot: {
				attribute: 'hide-from-root',
				type: Number
			},

			showMaxNodes: {
				attribute: 'show-max-nodes',
				type: Number
			},

			ellipsis: {
				type: String
			},

			_path: {
				type: Array,
				computed: '_computePath(ownerTree, keyProperty, keyValue)'
			},

			_pathToRender: {
				type: Array,
				computed: '_computePathToRender(_path, hideFromRoot, showMaxNodes)'
			},

			_pathText: {
				type: String,
				computed: '_computePathText(_pathToRender, valueProperty, pathSeparator)'
			}
		};
	}

	constructor() {
		super();
		this.ellipsis = '… / ';
		this.hideFromRoot = 0;
		this.pathSeparator = ' / ';
		this.showMaxNodes = 0;
		this.valueProperty = 'name';
	}

	_computePathToRender(path, hideFromRoot, showMaxNodes) {
		if (!path) {
			return;
		}
		let pathToRender = path;
		if (hideFromRoot > 0 && path.length > hideFromRoot) {
			pathToRender = path.slice(hideFromRoot);
		}

		if (showMaxNodes > 0 && pathToRender.length > showMaxNodes) {
			pathToRender = path.slice(-showMaxNodes);
		}
		return pathToRender;
	}

	/**
	 * Walks the path array from the end until an undefined part is found
	 * to make sure no unknown parts are present.
	 * @param {Array} inputPath Array of path parts
	 * @returns {Array} Array with defined parts
	 */
	getKnownPath(inputPath) {
		let path = inputPath;
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
	}

	_computePath(ownerTree, keyProperty, keyValue) {
		// HACK(pasleq): Cosmoz.Tree API needs to be fixed to avoid such code in components
		let path = null;

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

		return this.getKnownPath(path);
	}

	_computePathText(pathToRender, valueProperty, pathSeparator) {
		if (!pathToRender) {
			return '';
		}

		const stringParts = pathToRender.map(node =>
			this.ownerTree.getProperty(node, valueProperty)
		);

		let text = stringParts.join(pathSeparator);

		if (pathToRender.length < this._path.length) {
			text = this.ellipsis + text;
		}
		return text;
	}
}
customElements.define('cosmoz-treenode', CosmozTreenode);
