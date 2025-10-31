export default class jsExtension {
    /**
     * @param {string} type
     * @param {string} selector
     * @param {Function} callback
     * @param options
     * @param {HTMLElement|Document} parent
     */
    static addGlobalEventListener(type, selector, callback, options, parent = document) {
        parent.addEventListener(type, (eventListener) => {
            const target = eventListener.target;

            if (!(target instanceof Element)) return;

            if (target.matches(selector) || target.closest(selector)) {
                callback(eventListener);
            }
        }, options);
    }

    /**
     * @param {string} type
     * @param {Object} options
     * @returns {HTMLElement}
     */
    static createElement(type, options = {}) {
        const htmlElement = document.createElement(type);

        for(const [_key, _value] of /** @type {[string, string][]} */Object.entries(options)) {

            if(_key === "class") {
                htmlElement.classList.add(_value);
                break;
            }

            if(_key === "dataset") {
                Object.entries(_value).forEach(([dataKey, dataValue]) => {
                    htmlElement.dataset[dataKey] = dataValue;
                });
                break;
            }

            if(_key === "text") {
                htmlElement.textContent = _value;
                break;
            }

            htmlElement.setAttribute(_key, _value);
        }

        return htmlElement;
    }

    /**
     * @param {string} selector
     * @param {HTMLElement|Document} parent
     * @returns {Element|null}
     */
    static qs(selector, parent = document) {
        return parent instanceof Document || parent instanceof HTMLElement
            ? parent.querySelector(selector)
            : null;
    }

    /**
     * @param {string} selector
     * @param {HTMLElement|Document} parent
     * @returns {NodeList<Element>}
     */
    static qsa(selector, parent = document) {
        return parent instanceof Document || parent instanceof HTMLElement
            ? parent.querySelectorAll(selector)
            : document.querySelectorAll(selector);
    }

    /**
     * @param {string} str
     * @return {DocumentFragment}
     */
    static strToHtml(str) {
        return document.createRange().createContextualFragment(str.trim());
    }

    /**
     * @param str
     * @returns {boolean}
     */
    static isJson(str) {
        try { JSON.parse(str); } catch(e) { return false; }

        return true;
    }

    /**
     * @param {number} time
     * @returns {Promise<void>}
     */
    static sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

