# normalize.css

A personal CSS reset/normalize sheet. Combines sensible defaults from [normalize.css](https://necolas.github.io/normalize.css/) with opinionated resets for a clean baseline.

## What it does

- `box-sizing: border-box` globally
- Resets margins, fonts, and colors on form elements so they inherit from the page
- Makes media elements (`img`, `video`, `canvas`, etc.) block-level with `max-width: 100%`
- Sets `hyphens: auto` on common text containers
- Removes the default focus ring on `:focus`, restores it on `:focus-visible` (keyboard-only outline)
- Respects `prefers-reduced-motion` by collapsing animation/transition durations

## Usage

Link it before any other stylesheet:

```html
<link rel="stylesheet" href="normalize.css">
```
