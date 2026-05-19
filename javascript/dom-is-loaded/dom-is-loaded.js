/**
 * Resolves when all images on the page have finished loading.
 * Returns an array of booleans, one per image — true if loaded successfully, false if failed.
 *
 * @return {Promise<boolean[]>}
 */
export default function domIsLoaded() {
    const images = /** @type {HTMLImageElement[]} */ ([
        ...document.querySelectorAll('img[src]')
    ]);

    return Promise.all(
        images.map(img => new Promise(resolve => {
            if (img.complete) {
                resolve(img.naturalWidth > 0);
                return;
            }
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        }))
    );
}
