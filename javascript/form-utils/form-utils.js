export default class FormUtils {
    // CSS class names
    static CLASS = {
        formXHR: "form-xhr",
        formOnClick: "form-onclick",
        formOnChange: "form-onchange",
        radioContainer: "radio-container",
        radioInputWrapper: "radio-input-wrapper",
        radioChecked: "radio-checked"
    };

    // Reusable events
    static EVENTS = {
        submit: new Event("submit", {
            bubbles: true,
            cancelable: true
        }),
        change: new Event("change", {
            bubbles: true,
            cancelable: true
        }),
        click: new Event("click", {
            bubbles: true,
            cancelable: true
        })
    };

    /** Initialize form helpers inside an optional container (defaults to document)
     * @param {ParentNode|HTMLElement|null} container
     * @return {Promise<void>}
     */
    static async init(container = null) {
        const htmlRootElement = container ?? document;

        // File inputs: clear focus, mirror path, and preview image
        for(const _htmlInputElement of /** @type {NodeListOf<HTMLInputElement>} */(htmlRootElement.querySelectorAll("input[type='file']"))) {
            _htmlInputElement.addEventListener("change", FormUtils.clearFocus);
            _htmlInputElement.addEventListener("change", FormUtils.readPath);
            _htmlInputElement.addEventListener("change", FormUtils.readImage);
        }

        // Selects: clear focus on change
        for(const _htmlSelectElement of /** @type {NodeListOf<HTMLSelectElement>} */(htmlRootElement.querySelectorAll("select"))) {
            _htmlSelectElement.addEventListener("change", FormUtils.clearFocus);
        }

        // Forms: validate on submit; optionally re-dispatch submit on click/change
        for(const _htmlFormElement of /** @type {NodeListOf<HTMLFormElement>} */(htmlRootElement.querySelectorAll("form"))) {
            _htmlFormElement.addEventListener("submit", FormUtils.checkValidity);

            if(_htmlFormElement.classList.contains(FormUtils.CLASS.formOnClick)) {
                _htmlFormElement.addEventListener("click", FormUtils.dispatchSubmitEvent);
            }
            if(_htmlFormElement.classList.contains(FormUtils.CLASS.formOnChange)) {
                _htmlFormElement.addEventListener("change", FormUtils.dispatchSubmitEvent);
            }
        }

        // Radio-style groups
        await FormUtils.initRadios(container);
    }

    /** Remove focus from the active element */
    static clearFocus() {
        const activeElement = /** @type {HTMLElement|null} */ (document.activeElement);

        if(activeElement && typeof activeElement.blur === "function") {
            activeElement.blur();
        }
    }

    /**
     * Mirror selected filename into a sibling input[name="file-path"].
     * @param {Event} event
     */
    static readPath(event) {
        const htmlInputElement = /** @type {HTMLInputElement} */ (event.currentTarget);
        const filePathInput = /** @type {HTMLInputElement|null} */ (
            htmlInputElement.parentElement?.querySelector("input[name='file-path']")
        );

        if(!filePathInput || !htmlInputElement.files?.[0]) {
            return;
        }

        const value = htmlInputElement.value;
        const startIndex = value.lastIndexOf(value.includes('\\') ? '\\' : '/');

        filePathInput.value = startIndex >= 0
            ? value.substring(startIndex + 1)
            : value;
    }

    /**
     * If the chosen file is an image, preview it into the element referenced by data-file-preview-target.
     * @param {Event} event
     */
    static readImage(event) {
        const input = /** @type {HTMLInputElement} */ (event.currentTarget);
        const file = input.files?.[0];

        if (!file || !file.type.startsWith("image/")) return;

        const targetId = input.dataset.filePreviewTarget
        const previewImg = targetId ?
            /** @type {HTMLImageElement|null} */ (document.getElementById(targetId))
            : null;

        if (!previewImg) return;

        const reader = new FileReader();

        reader.onload = (progressEvent) => {
            previewImg.src = String(progressEvent.target?.result ?? "");
        };

        reader.readAsDataURL(file);
    }

    /** Dispatch a synthetic submit on the current form */
    static dispatchSubmitEvent(event) {
        const htmlFormElement = /** @type {HTMLFormElement} */ (event.currentTarget);
        htmlFormElement?.dispatchEvent(FormUtils.EVENTS.submit);
    }

    /** Trim all text/number inputs and textareas within the form
     * @param {HTMLFormElement} htmlFormElement
     */
    static async trimInputs(htmlFormElement) {
        for(const _htmlElement of /** @type {(HTMLInputElement|HTMLTextAreaElement)[]} */ (htmlFormElement.querySelectorAll("input[type='text'], input[type='number'], textarea"))) {
            _htmlElement.value = _htmlElement.value.trim();
        }
    }

    /** Validate form, optionally submit via XHR if .form-xhr is present
     * @param {Event} event
     * @this {HTMLFormElement}
     */
    static async checkValidity(event) {
        event.preventDefault();
        FormUtils.clearFocus();

        const htmlFormElement = /** @type {HTMLFormElement} */ (event.currentTarget);
        await FormUtils.trimInputs(htmlFormElement);

        if(htmlFormElement.checkValidity()) {
            if(htmlFormElement.classList.contains(FormUtils.CLASS.formXHR)) {
                FormUtils.ajaxRequest(htmlFormElement);
            } else {
                htmlFormElement.submit();
            }
        } else {
            htmlFormElement.reportValidity();
        }
    }

    /** Submit the form via XHR and process JSON responses
     * @param {HTMLFormElement} htmlFormElement
     */
    static ajaxRequest(htmlFormElement) {
        const xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.responseType = "json";
        xmlHttpRequest.onload = () => FormUtils.ajaxResponse(xmlHttpRequest);

        xmlHttpRequest.open(htmlFormElement.method || "POST", htmlFormElement.action);
        xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlHttpRequest.send(new FormData(htmlFormElement));
    }

    /**
     * Handle XHR load event and react to simple JSON instructions.
     * Recognized format: { "::function": [ { name: "log", params: any } ] }
     * @param {XMLHttpRequest} xmlHttpRequest
     */
    static ajaxResponse(xmlHttpRequest) {
        const { status, response } = xmlHttpRequest;

        // Treat any 2xx as success
        if(status < 200 || status >= 300) {
            console.error({
                status: "error",
                httpStatus: status,
                message: "Ajax request error"
            });

            return;
        }

        if (!response || typeof response !== "object") return;

        //ToDo - Logic example, edit/expand as needed
        if("::function" in response) {
            for(const _fn of response["::function"]) {
                const { name, params } = _fn || {};

                switch(name) {
                    case "log": console.log(params); break;
                    default:
                        // unsupported action; ignore silently
                        break;
                }
            }
        }
    }

    // ---------- Radio helpers ----------

    /** Initialize radio-style containers
     * @param {Document|HTMLElement|DocumentFragment|null} container
     */
    static initRadios(container = null) {
        const htmlRootElement = container ?? document;
        const radioContainerList = /** @type {NodeListOf<HTMLElement>} */ (htmlRootElement.querySelectorAll(`.${FormUtils.CLASS.radioContainer}`));

        for(const _radioContainerElement of radioContainerList) {
            if (_radioContainerElement.dataset.radiosInitialized === "1") continue;
            _radioContainerElement.dataset.radiosInitialized = "1";


            for(const _htmlRadioInputElement of /** @type {NodeListOf<HTMLInputElement>} */ (_radioContainerElement.querySelectorAll(`.${FormUtils.CLASS.radioInputWrapper} input`))) {
                _htmlRadioInputElement.closest(`.${FormUtils.CLASS.radioInputWrapper}`)?.classList.add(`radio-type-${_htmlRadioInputElement.type}`);
            }

            _radioContainerElement.addEventListener("change", FormUtils.radioChangeListener);
            // trigger initial state
            _radioContainerElement.dispatchEvent(FormUtils.EVENTS.change);
        }
    }

    /** Update label state based on checked inputs
     * @param {Event} event
     */
    static radioChangeListener(event) {
        const radioContainerElement = event.currentTarget;

        for(const _htmlLabelElement of /** @type {NodeListOf<HTMLLabelElement>} */ (radioContainerElement.querySelectorAll("label"))) {
            const htmlInputElement = /** @type {HTMLInputElement|null} */ (_htmlLabelElement.querySelector("input"));

            if(!htmlInputElement) continue;

            _htmlLabelElement.classList.toggle(
                FormUtils.CLASS.radioChecked,
                htmlInputElement.checked
            );

            if(htmlInputElement.checked === true) {
                _htmlLabelElement.classList.add(FormUtils.CLASS.radioChecked);
            } else {
                _htmlLabelElement.classList.remove(FormUtils.CLASS.radioChecked);
            }
        }
    }
}
