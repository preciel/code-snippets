# form-utils (JavaScript)

Small, dependency‑free helpers to improve form UX and simplify common patterns:
- Auto‑wire typical form behaviors (trim inputs, validate, optional XHR submit)
- File input niceties (mirror selected filename, preview images)
- "Submit on click/change" forms via CSS classes
- Lightweight XHR flow with a minimal JSON response convention
- Radio groups with label state syncing

## Quick usage

Minimal setup; adjust paths as needed.

```html
<!-- Example HTML -->
<form class="form-xhr form-onchange" method="post" action="/upload">
  <div>
    <input type="file" name="file" data-file-preview-target="preview-img" />
    <input type="text" name="file-path" placeholder="Selected file…" />
    <img id="preview-img" alt="Preview" />
  </div>

  <div class="radio-container">
    <label class="radio-input-wrapper">
      <input type="radio" name="size" value="s" /> Small
    </label>
    <label class="radio-input-wrapper">
      <input type="radio" name="size" value="m" /> Medium
    </label>
  </div>

  <button type="submit">Submit</button>
</form>

<script type="module">
  import FormUtils from "./form-utils.js";
  // Initialize helpers for the whole document (or pass a container element)
  await FormUtils.init();
</script>
```

What this does:
- Trims all text/number inputs and textareas before submit
- Validates the form; if valid:
  - `.form-xhr` → submits with `XMLHttpRequest` and processes a simple JSON response
  - otherwise → performs a normal form submit
- `.form-onchange` → also triggers submit when any field changes
- `.form-onclick` → also triggers submit when the form is clicked
- File input:
  - Mirrors the chosen filename to a sibling `input[name="file-path"]`
  - If the file is an image and `data-file-preview-target` points to an `<img>`, previews it
- Radio UI:
  - In a `.radio-container`, toggles `.radio-checked` on labels whose input is checked

## Markup conventions

- Classes used by the helpers:
  - `form-xhr` — submit via XHR instead of regular navigation
  - `form-onclick` — dispatch a submit event when the form is clicked
  - `form-onchange` — dispatch a submit event when any field changes
  - `radio-container` — wrapper enabling radio label syncing
  - `radio-input-wrapper` — wrapper around each radio/checkbox input
  - `radio-checked` — added to a label when its input is checked

- File preview:
  - Add `data-file-preview-target="some-id"` on the file input
  - Provide `<img id="some-id">` to receive the preview
  - Optional: add a sibling `input[name="file-path"]` to mirror the filename

## JSON response convention (XHR)

When a `.form-xhr` form is submitted, the response is expected to be JSON. Non‑2xx statuses are logged as errors. A minimal, extensible convention is supported:

```json
{
  "::function": [
    { "name": "log", "params": { "ok": true } }
  ]
}
```

Currently supported actions:
- `log` — `console.log(params)`

Unrecognized actions are ignored without error.

## API (overview)

All methods are static on `FormUtils`:
- `init(container?)` — wires up inputs, selects, forms, and radio groups within `container` (or `document`)
- `clearFocus()` — blurs the active element
- `readPath(event)` — mirrors selected filename into a sibling `input[name="file-path"]`
- `readImage(event)` — previews chosen image into the `<img>` referenced by `data-file-preview-target`
- `dispatchSubmitEvent(event)` — dispatches a synthetic `submit` on the current form
- `trimInputs(form)` — trims text/number inputs and textareas
- `checkValidity(event)` — validates; normal submit or XHR depending on presence of `.form-xhr`
- `ajaxRequest(form)` / `ajaxResponse(xhr)` — XHR submit and response handling
- `initRadios(container?)` / `radioChangeListener(event)` — label state syncing for radio groups

Notes:
- Assumes a browser environment (DOM APIs available).
- Non‑blocking and dependency‑free.

## License

See the repository‑level `LICENSE` file.
