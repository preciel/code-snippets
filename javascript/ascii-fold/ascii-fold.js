/**
 * @typedef {Object} AsciiFoldOptions
 * @property {"plain"|"paren"} [marksStyle="plain"]  How to render © ® ™ ℠ (plain: "c", "r", "tm", "sm"; paren: "(c)", "(r)", "(tm)", "(sm)")
 * @property {boolean} [asciiOnly=true]              If true, removes any remaining non-ASCII chars after mapping
 * @property {string}  [unknown="?"]                 Replacement for still-unknown non-ASCII when asciiOnly=false
 */

const ligaturesMap = new Map([
    // Common typographic ligatures
    ["\uFB00", "ff"], ["\uFB01", "fi"], ["\uFB02", "fl"],
    ["\uFB03", "ffi"], ["\uFB04", "ffl"],
    ["\uFB05", "st"], ["\uFB06", "st"],
    // Latin letters that don't decompose via NFKD the way we want
    ["Æ", "AE"], ["æ", "ae"],
    ["Œ", "OE"], ["œ", "oe"],
    ["ß", "ss"],
    ["Þ", "Th"], ["þ", "th"],
    ["Ð", "D"], ["ð", "d"],
    ["Ł", "L"], ["ł", "l"],
    ["Ø", "O"], ["ø", "o"],
    ["Đ", "D"], ["đ", "d"]
]);

/** Symbols, punctuation, and marks with sensible ASCII fallbacks */
function makeSymbolsMap(marksStyle = "plain") {
    const tm = marksStyle === "paren" ? "(tm)" : "tm";
    const sm = marksStyle === "paren" ? "(sm)" : "sm";
    const r = marksStyle === "paren" ? "(r)" : "r";
    const c = marksStyle === "paren" ? "(c)" : "c";

    return new Map([
        // Legal & marks
        ["\u00A9", c],   // ©
        ["\u00AE", r],   // ®
        ["\u2122", tm],  // ™
        ["\u2120", sm],  // ℠

        // Quotes → straight ASCII
        ["\u2018", "'"],
        ["\u2019", "'"],
        ["\u201A", "'"],
        ["\u201B", "'"],
        ["\u201C", "\""],
        ["\u201D", "\""],
        ["\u201E", "\""],
        ["\u201F", "\""],

        // Dashes & ellipsis
        ["\u2013", "-"],  // – en dash
        ["\u2014", "-"],  // — em dash
        ["\u2212", "-"],  // − minus
        ["\u2026", "..."],// … ellipsis

        // Misc symbols
        ["\u00B0", "deg"],// °
        ["\u00D7", "x"],  // ×
        ["\u00F7", "/"],  // ÷
        ["\u2022", "*"],  // •
        ["\u00A0", " "],  // non-breaking space
        ["\u2007", " "],  // figure space
        ["\u202F", " "],  // narrow no-break space
        ["\u2009", " "],  // thin space
        ["\u2002", " "], ["\u2003", " "], ["\u2004", " "], ["\u2005", " "], ["\u2006", " "], ["\u2008", " "], ["\u200A", " "], ["\u205F", " "], ["\u3000", " "], // spaces
        ["\u200B", ""],   // zero-width space
        ["\u200C", ""], ["\u200D", ""], ["\uFEFF", ""], // zero-width non-joiner/joiner & BOM
        // Fractions (basic)
        ["\u00BD", "1/2"], ["\u00BC", "1/4"], ["\u00BE", "3/4"]
    ]);
}

/**
 * Convert a string to a best-effort ASCII equivalent.
 * 1) Normalize to NFKD (compatibility decomposition)
 * 2) Remove combining marks \p{M}
 * 3) Apply explicit ligature/letter & symbol maps
 * 4) Optionally force pure ASCII
 *
 * @param {string} input
 * @param {AsciiFoldOptions} [options]
 * @returns {string}
 */
export function toASCII(input, options = {}) {
    const {
        marksStyle = "plain",
        asciiOnly = true,
        unknown = "?"
    } = options;

    if(input == null) {
        return "";
    }

    // Step 1/2: Normalize + strip combining marks
    let output = input
        .normalize("NFKD")
        .replace(/\p{M}+/gu, ""); // remove diacritical combining marks

    // Step 3a: known ligatures/letters that NFKD doesn't map as desired
    output = [...output].map(_char => ligaturesMap.get(_char) ?? _char).join("");

    // Step 3b: symbols & punctuation fallbacks
    const symbolsMap = makeSymbolsMap(marksStyle);
    output = [...output].map(_char => symbolsMap.get(_char) ?? _char).join("");

    // Step 4: optionally enforce ASCII-only
    if(asciiOnly) {
        // Replace anything outside U+0000..U+007F with nothing
        output = output.replace(/[^\x00-\x7F]+/g, "");
    } else {
        // Keep but flag unknowns
        output = output.replace(/[^\x00-\x7F]/g, unknown);
    }

    return output;
}

/**
 * Convert a string into a slug-style ASCII string.
 *
 * @param {string} input
 * @param {{
 *   separator?: string,
 *   caseStyle?: "lower" | "upper" | "title" | "camel" | "pascal" | "none",
 *   strict?: boolean,
 *   toASCIIOptions?: AsciiFoldOptions
 * }} [options]
 * @returns {string}
 */
export function toSlug(input, options = {}) {
    const {
        separator = "-",
        caseStyle = "lower",
        strict = false,
        toASCIIOptions = {
            marksStyle: "plain",
            asciiOnly: true,
            unknown: "?"
        }
    } = options;

    let slug = toASCII(input, toASCIIOptions);

    slug = slug
        .replace(/[^A-Za-z0-9]+/g, separator)
        .replace(new RegExp(`${separator}{2,}`, "g"), separator)
        .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");

    switch(caseStyle) {
        case "none": break; // Keep whatever case remains after toASCII()
        case "upper": slug = slug.toUpperCase(); break;
        case "lower":
        default: slug = slug.toLowerCase(); break;
    }

    if (strict) {
        slug = slug.replace(new RegExp(`[^A-Za-z0-9${separator}]`, "g"), "");
    }

    return slug;
}
