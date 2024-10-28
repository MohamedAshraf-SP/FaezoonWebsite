export function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u064B-\u0652]/g, "");
}