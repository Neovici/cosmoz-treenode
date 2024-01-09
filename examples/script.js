import { DefaultTree } from '@neovici/cosmoz-tree/cosmoz-default-tree.js';

const elements = document.querySelectorAll('cosmoz-treenode');

fetch('tree.json').then(r => r.json()).then(jsonTree => {
    const tree = new DefaultTree(jsonTree);
    elements.forEach(el => {
        el.ownerTree = tree;
    });
});