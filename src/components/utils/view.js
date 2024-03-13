/*--------------------------------------------------view--------------------------------------------------*/
//load all, then spawn views
export function loadElements(container) {
    const background = new Image();
    background.src = "./src/components/images/background_optimized.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;
        container.classList.add('loaded');
    };
};