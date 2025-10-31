# js-extension (JavaScript)

A tiny, dependency‑free utility class with a few DOM and string helpers that I often reach for in small projects and prototypes.

It includes:
- `addGlobalEventListener` — delegated events with a CSS selector
- `createElement` — quick DOM element creation with attributes, class, dataset, and text
- `qs` / `qsa` — short aliases for `querySelector` / `querySelectorAll` with optional parent
- `strToHtml` — convert an HTML string to a `DocumentFragment`
- `isJson` — quick check if a string parses as JSON
- `sleep` — simple delay (`Promise`-based)

## Quick usage

Minimal examples showing what the helpers do. Adjust to your environment as needed.

```js
// Assume jsExtension is available in scope

// 1) Delegated event listener
jsExtension.addGlobalEventListener("click", "[data-action=remove]", (e) => {
  const btn = e.target.closest("[data-action=remove]");
  btn?.closest(".item")?.remove();
});

// 2) Create element with attributes, class, dataset, and text
const card = jsExtension.createElement("div", {
  class: "card",
  id: "card-1",
  dataset: { id: "1", type: "example" },
  "aria-label": "Example card",
  text: "Hello!",
});

// 3) Shorthand query helpers
const firstItem = jsExtension.qs(".item");
const allItems = jsExtension.qsa(".item");

// 4) String to HTML fragment
const frag = jsExtension.strToHtml(`
  <ul>
    <li>One</li>
    <li>Two</li>
  </ul>
`);
document.body.appendChild(frag);

// 5) JSON check
jsExtension.isJson('{"a":1}'); // true
jsExtension.isJson('{a:1}');    // false

// 6) Sleep helper
await jsExtension.sleep(300);
```

## API

### `addGlobalEventListener(type, selector, callback, options?, parent=document)`
Adds a single delegated listener on `parent` and runs `callback` when the event target matches `selector` (or is inside an element that matches).

- `type`: string event type, e.g. `"click"`
- `selector`: CSS selector to match or `closest()` to
- `callback`: function receiving the event
- `options`: optional `addEventListener` options
- `parent`: `HTMLElement | Document` (defaults to `document`)

### `createElement(type, options={}) => HTMLElement`
Creates an element and applies the provided options.
Supported option keys:
- `class`: string — added via `classList.add`
- `dataset`: object — assigned to `element.dataset[key] = value`
- `text`: string — sets `textContent`
- any other key — assigned as attribute: `setAttribute(key, value)`

### `qs(selector, parent=document) => Element|null`
Shorthand for `parent.querySelector(selector)`. Returns `null` if `parent` is not a `Document`/`HTMLElement`.

### `qsa(selector, parent=document) => NodeList<Element>`
Shorthand for `parent.querySelectorAll(selector)`. Falls back to `document.querySelectorAll` when `parent` is not a `Document`/`HTMLElement`.

### `strToHtml(str) => DocumentFragment`
Converts an HTML string into a `DocumentFragment` using `Range#createContextualFragment`.

### `isJson(str) => boolean`
Returns `true` if `JSON.parse(str)` succeeds; otherwise `false`.

### `sleep(time) => Promise<void>`
Resolves after `time` milliseconds using `setTimeout`.

## Notes
- DOM helpers assume a browser environment (i.e., `document` is available).
- `addGlobalEventListener` uses event delegation; attach it once at a suitable ancestor.

## License

See the repository-level `LICENSE` file.
