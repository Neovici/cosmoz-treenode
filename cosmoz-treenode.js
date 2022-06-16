import { component, html } from 'haunted';

const computePathToRender = (path, hideFromRoot, showMaxNodes) => {
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
	},
	/**
	 * Walks the path array from the end until an undefined part is found
	 * to make sure no unknown parts are present.
	 * @param {Array} inputPath Array of path parts
	 * @returns {Array} Array with defined parts
	 */
	getKnownPath = (inputPath) => {
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
	},
	computePath = (ownerTree, keyProperty, keyValue) => {
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

		return getKnownPath(path);
	},
	computePathText = ({
		ownerTree,
		ellipsis,
		pathToRender,
		path,
		valueProperty,
		pathSeparator,
	}) => {
		if (!pathToRender) {
			return '';
		}

		const stringParts = pathToRender.map((node) =>
			ownerTree.getProperty(node, valueProperty)
		);

		let text = stringParts.join(pathSeparator);

		if (pathToRender.length < path.length) {
			text = ellipsis + text;
		}
		return text;
	},
	Treenode = ({
		valueProperty = 'name',
		pathSeparator = ' / ',
		hideFromRoot = 0,
		showMaxNodes = 0,
		keyProperty,
		keyValue,
		ownerTree,
		ellipsis = '… / ',
	}) => {
		const path = computePath(ownerTree, keyProperty, keyValue),
			pathToRender = computePathToRender(path, hideFromRoot, showMaxNodes),
			pathText = computePathText({
				ownerTree,
				ellipsis,
				pathToRender,
				path,
				valueProperty,
				pathSeparator,
			});

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
				@media not all and (min-resolution: 0.001dpcm) {
					@supports (-webkit-appearance: none) {
						:host span {
							display: inline-block;
						}
					}
				}
			</style>
			<span title=${pathText}>&lrm;${pathText}</span>
		`;
	};

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
		],
	})
);
