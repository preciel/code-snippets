# touch-debugger

Renders a visible dot for each active touch point on the screen. Useful for debugging touch interactions on mobile devices or emulators.

Each dot tracks its touch point through `touchmove` and is removed on `touchend`. Dots are positioned using `clientX`/`clientY` to stay aligned with the viewport regardless of scroll position.

## Usage

```js
import { touchDebuggerInit } from './touch-debugger.js';

touchDebuggerInit();
```

Call once on page load. Intended for development use only.
