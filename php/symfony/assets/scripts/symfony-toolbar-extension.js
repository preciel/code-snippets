const toolbarBlockTemplate =
`<div class="sf-toolbar-block sf-toolbar-block-time sf-toolbar-status-normal">
    <a href="javascript:void(0)">
        <div class="sf-toolbar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" data-icon-name="icon-client-view" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" style="display: inline-block !important;">
                <rect x="3" y="4" width="18" height="12" rx="2" ry="2" fill="none" stroke="white" stroke-width="2"/>
                <line x1="10" y1="19" x2="14" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="sf-toolbar-value"></span>
            <span class="sf-toolbar-label"></span>
        </div>
    </a>
    <div class="sf-toolbar-info">
        <div class="sf-toolbar-info-piece">
            <b>Screen width</b>
            <span data-screen-width></span>
        </div>
        <div class="sf-toolbar-info-piece">
            <b>Screen Height</b>
            <span data-screen-height></span>
        </div>
        <div class="sf-toolbar-info-piece">
            <b>Viewport width</b>
            <span data-viewport-width></span>
        </div>
        <div class="sf-toolbar-info-piece">
            <b>Viewport Height</b>
            <span data-viewport-height></span>
        </div>
    </div>
</div>`;

function waitForToolbar() {
    return new Promise(resolve => {
        const existing = document.querySelector('.sf-toolbar');

        if(existing) {
            resolve(existing);
            return;
        }

        const observer = new MutationObserver(() => {
            const toolbar = document.querySelector('.sf-toolbar');

            if(toolbar) {
                observer.disconnect();
                resolve(toolbar);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

function waitForToolbarBlocks(toolbar) {
    return new Promise(resolve => {
        const blocks = toolbar.querySelectorAll('.sf-toolbarreset .sf-toolbar-block');

        if(blocks.length >= 2) {
            resolve(blocks);
            return;
        }

        const observer = new MutationObserver(() => {
            const currentBlocks = toolbar.querySelectorAll('.sf-toolbarreset .sf-toolbar-block');

            if(currentBlocks.length >= 2) {
                observer.disconnect();
                resolve(currentBlocks);
            }
        });

        observer.observe(toolbar, { childList: true, subtree: true });
    });
}

export async function symfonyToolbarExtensionInit() {
    const toolbar = await waitForToolbar();
    const blocks = await waitForToolbarBlocks(toolbar);

    blocks[blocks.length - 2].insertAdjacentHTML('afterend', toolbarBlockTemplate);

    const screenWidthElement = toolbar.querySelector('[data-screen-width]');
    const screenHeightElement = toolbar.querySelector('[data-screen-height]');
    const viewportWidthElement = toolbar.querySelector('[data-viewport-width]');
    const viewportHeightElement = toolbar.querySelector('[data-viewport-height]');

    screenWidthElement.textContent = `${screen.width}px`;
    screenHeightElement.textContent = `${screen.height}px`;
    viewportWidthElement.textContent = `${window.innerWidth}px`;
    viewportHeightElement.textContent = `${window.innerHeight}px`;

    window.addEventListener('resize', () => {
        viewportWidthElement.textContent = `${window.innerWidth}px`;
        viewportHeightElement.textContent = `${window.innerHeight}px`;
    });
}
