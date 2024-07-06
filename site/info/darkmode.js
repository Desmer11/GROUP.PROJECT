function toggleDarkMode() {
    const body = document.body;
    const darkModeClass = 'dark-mode';

    if (body.classList.contains(darkModeClass)) {
        body.classList.remove(darkModeClass);
        restoreOriginalStyles();
    } else {
        body.classList.add(darkModeClass);
        applyDarkModeStyles();
    }
}

function applyDarkModeStyles() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        const color = computedStyle.color;

        if (isLightMonochrome(bgColor)) {
            element.dataset.originalBgColor = element.style.backgroundColor || '';
            element.style.backgroundColor = '#1e1e1e';
        }
        if (isLightMonochrome(color)) {
            element.dataset.originalColor = element.style.color || '';
            element.style.color = '#ffffff';
        }
    });
}

function restoreOriginalStyles() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        if (element.dataset.originalBgColor) {
            element.style.backgroundColor = element.dataset.originalBgColor;
            delete element.dataset.originalBgColor;
        } else {
            element.style.backgroundColor = '';
        }

        if (element.dataset.originalColor) {
            element.style.color = element.dataset.originalColor;
            delete element.dataset.originalColor;
        } else {
            element.style.color = '';
        }
    });
}

function isLightMonochrome(color) {
    if (!color || color === 'transparent') return false;
    const rgb = color.match(/\d+/g);
    if (!rgb) return false;
    const [r, g, b] = rgb.map(Number);
    const average = (r + g + b) / 3;
    const threshold = 230;
    return Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && average > threshold;
}

document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
