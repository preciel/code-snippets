# dom-offset

Utilities to get the pixel offset of a DOM element relative to a parent or the document.

All functions account for CSS transforms and scroll position via `getBoundingClientRect()`.

## Functions

### `getOffsetFrom(element, parent?)`

Returns the offset of `element` relative to `parent`. If `parent` is omitted, returns the offset relative to the document (same as `getOffsetFromDocument`).

### `getOffsetFromParent(element)`

Returns the offset of `element` relative to its direct parent element.

### `getOffsetFromDocument(element)`

Returns the offset of `element` relative to the document origin.

## Usage

```js
import { getOffsetFrom, getOffsetFromParent, getOffsetFromDocument } from './dom-offset.js';

const el = document.querySelector('.my-element');

getOffsetFromDocument(el);           // { x: 120, y: 340 }
getOffsetFromParent(el);             // { x: 16, y: 32 }
getOffsetFrom(el, el.closest('.container')); // { x: 16, y: 80 }
```
