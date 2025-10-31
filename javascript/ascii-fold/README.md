# ascii-fold (JavaScript)

Best-effort ASCII folding and slug generation utilities extracted from a reusable snippet. It focuses on practical, predictable results:

- Removes diacritics using Unicode NFKD normalization and strips combining marks
- Handles common ligatures and special Latin letters (Æ/æ → AE/ae, ß → ss, etc.)
- Maps typographic quotes, dashes, ellipsis, spaces, and a few symbols to sensible ASCII
- Optional strict ASCII-only output or keep-non-ASCII-with-placeholder
- Includes a small `toSlug` helper built on top of `toASCII`

## Quick usage

Minimal examples showing what the functions do. Adjust to your environment as needed.

```js
// Assume you have the functions available in scope

const input = "Café™ — 50 °C";

// Basic ASCII folding (default: asciiOnly=true, marksStyle="plain")
const ascii = toASCII(input);
// => "Cafe tm - 50 C"

// Keep non-ASCII by substituting unknowns
const kept = toASCII("Emoji: 😀", { asciiOnly: false, unknown: "?" });
// => "Emoji: ?"

// Slugify
const slug = toSlug("Hello, World! © 2025");
// => "hello-world-c-2025"
```

## Functions

### `toASCII(input, options)`
Converts a string to a best-effort ASCII equivalent:
1) NFKD normalize, 2) strip combining marks, 3) map ligatures/letters and symbols, 4) optionally enforce ASCII-only.

Options (`AsciiFoldOptions`):
- `marksStyle`: `"plain" | "paren"` (default `"plain"`)
  - `"plain"`: © ® ™ ℠ → `c r tm sm`
  - `"paren"`: © ® ™ ℠ → `(c) (r) (tm) (sm)`
- `asciiOnly`: `boolean` (default `true`)
  - When `true`, removes any remaining non-ASCII after mapping
  - When `false`, keeps non-ASCII but replaces still-unknowns with `unknown`
- `unknown`: `string` (default `"?"`)
  - Placeholder for non-ASCII characters that remain when `asciiOnly=false`

Examples:
```js
toASCII("Äffin – ½ kg", { marksStyle: "paren" });
// => "Affin - 1/2 kg"

toASCII("naïve façade", {});
// => "naive facade"
```

### `toSlug(input, options)`
Builds on `toASCII` and normalizes to a URL-friendly slug.

Options:
- `separator`: string (default `"-"`)
- `caseStyle`: `"lower" | "upper" | "none"` (default `"lower"`)
- `strict`: `boolean` (default `false`)
  - When `true`, removes everything except `A–Z a–z 0–9` and the chosen separator
- `toASCIIOptions`: `AsciiFoldOptions` (passed to `toASCII` first)

Examples:
```js
toSlug("Crème brûlée — ©", { separator: "-" });
// => "creme-brulee-c"

toSlug("Über cool", { caseStyle: "upper", separator: "_" });
// => "UBER_COOL"
```

## Notes on behavior

- Ligatures and special letters handled explicitly: ff/fi/fl/ffi/ffl, Æ/æ, Œ/œ, ß, Þ/þ, Ð/ð, Ł/ł, Ø/ø, Đ/đ
- Typographic punctuation mapped to ASCII: curly quotes → straight quotes, en/em dashes → `-`, ellipsis → `...`, non-breaking and thin/figure spaces → normal space
- Some miscellaneous symbols mapped: `° → deg`, `× → x`, `÷ → /`, `• → *`, simple fraction glyphs like `½ ¼ ¾`
- Zero-width marks (ZWNJ/ZWJ/BOM) are removed

## License

See the repository-level `LICENSE` file.
