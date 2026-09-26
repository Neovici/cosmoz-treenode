---
'@neovici/cosmoz-treenode': major
---

Migrate to the async cosmoz-tree 4 API.

`computePath` and `computePathText` now return promises, and
`@neovici/cosmoz-tree` is bumped to `^4.0.0`. The element renders its
`fallback` prop while the path is unresolved and swaps in the resolved path
once it arrives.

The `render` export is removed.
