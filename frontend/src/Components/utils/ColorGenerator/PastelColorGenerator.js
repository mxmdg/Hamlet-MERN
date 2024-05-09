function getRandomPastelColor() {
    // Genera un color en formato HSL con saturación entre 25% y 95% y luminosidad entre 85% y 95%
    const hue = 360 * Math.random();
    const saturation = 25 + 70 * Math.random();
    const lightness = 85 + 10 * Math.random();

    // Convierte el color HSL a RGB
    const rgbColor = hslToRgb(hue, saturation, lightness);

    // Formatea el color como #RRGGBB
    const hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);

    return hexColor;
}

// Genera un array de 10 colores pasteles
const pastelColors = [];
for (let i = 0; i < 10; i++) {
    pastelColors.push(getRandomPastelColor());
}

console.log(pastelColors);

// Función para convertir HSL a RGB
function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (0 <= h && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// Función para convertir RGB a formato hexadecimal
function rgbToHex(r, g, b) {
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default pastelColors