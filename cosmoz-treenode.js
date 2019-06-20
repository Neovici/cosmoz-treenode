import { Tree } from '@neovici/cosmoz-tree';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

/**
 * `cosmoz-treenode` is a component to display a node in a `cosmoz-tree` data structure
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
class CosmozTreenode extends PolymerElement {
	static get is() {
		return 'cosmoz-treenode';
	}

	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				:host([no-wrap]) {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			</style>
			<span>[[ _pathText ]]</span>
		`;
	}

	static get properties() {
		return {

			/**
			* Name of the property used to lookup the displayed node in the tree
			*/
			keyProperty: {
				type: String
			},

			/**
			* The value for the `keyProperty` used to lookup the node in the tree.
			*/
			keyValue: {
				type: String
			},

			ownerTree: {
				type: Tree
			},

			valueProperty: {
				type: String,
				value: 'name'
			},

			pathSeparator: {
				type: String,
				value: ' / '
			},

			/**
			* Represent a number of nodes that should not be rendered starting from root.
			* If the path to the displayed node has less nodes than this number, then nothing is hidden.
			*/
			hideFromRoot: {
				type: Number,
				value: 0
			},

			showMaxNodes: {
				type: Number,
				value: 0
			},

			ellipsis: {
				type: String,
				value: '… / '
			},

			noWrap: {
				type: Boolean,
				reflectToAttribute: true
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

	_computePathToRender(path, hideFromRoot, showMaxNode) {
		if (!path) {
			return;
		}
		let pathToRender = path;
		if (hideFromRoot > 0 && path.length > hideFromRoot) {
			pathToRender = path.slice(hideFromRoot);
		}

		if (showMaxNode > 0 && pathToRender.length > showMaxNode) {
			pathToRender = path.slice(-showMaxNode);
		}
		return pathToRender;
	}

	/* eslint-disable-next-line max-statements */
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
		if (Array.isArray(path) && path.length) {
			for (let i = path.length - 1; i >= 0; i--) {
				if (path[i] === undefined) {
					path.splice(0, i + 1);
					if (path.length === 0) {
						path = null;
					}
					break;
				}
			}
		}
		return path;
	}

	_computePathText(pathToRender, valueProperty, pathSeparator) {
		if (!pathToRender) {
			return;
		}
		let text = pathToRender.map(node => {
			return this.ownerTree.getProperty(node, valueProperty);
		}).join(pathSeparator);

		if (pathToRender.length < this._path.length) {
			text = this.ellipsis + text;
		}
		return text;
	}
}
customElements.define(CosmozTreenode.is, CosmozTreenode);
