/**
 * @param {HTMLElement} element
 * @param {HTMLElement|null} parent
 * @return {{x: number, y: number}}
 */
export function getOffsetFrom(element, parent = null) {
    const rect = element.getBoundingClientRect();

    if (!parent) {
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        };
    }

    const parentRect = parent.getBoundingClientRect();
    return {
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
    };
}

/**
 * @param {HTMLElement} element
 * @return {{x: number, y: number}}
 */
export function getOffsetFromParent(element) {
    return getOffsetFrom(element, element.parentElement);
}

/**
 * @param {HTMLElement} element
 * @return {{x: number, y: number}}
 */
export function getOffsetFromDocument(element) {
    return getOffsetFrom(element);
}
