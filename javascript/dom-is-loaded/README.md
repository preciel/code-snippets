# dom-is-loaded

Resolves when all images on the page have finished loading. Intended for use with page loaders that need to wait for all images before hiding a loading screen.

Returns a `Promise<boolean[]>` — one entry per image, `true` if the image loaded successfully, `false` if it failed. This lets the caller decide how to handle partial failures.

Images already loaded from cache are handled correctly via `img.complete` and `img.naturalWidth`, without needing to re-trigger a load.

## Usage

```js
import domIsLoaded from './dom-is-loaded.js';

domIsLoaded().then(results => {
    const failed = results.filter(r => !r).length;

    if (failed > 0) {
        console.warn(`${failed} image(s) failed to load.`);
    }

    hideLoader();
});
```
