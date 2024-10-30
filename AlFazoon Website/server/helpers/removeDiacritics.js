function removeTashkeel(text) {
    return text.normalize("NFD").replace(/[\u064B-\u0652]/g, "");
}

/*
function normalizeArabic(text) {
    return text
        .replace(/[أإآ]/g, 'ا')    // Normalize different forms of "ا" to "ا"
        .replace(/ة/g, 'ه')        // Normalize "ة" to "ه"
        .replace(/[ؤ]/g, 'و')      // Normalize "ؤ" to "و"
        .replace(/[ئ]/g, 'ي')      // Normalize "ئ" to "ي"
        .replace(/[ى]/g, 'ي')      // Normalize "ى" to "ي"
    //  .replace(/[^ء-ي\s]/g, ''); // Optionally remove any other non-Arabic characters
}

*/

function normalizeArabic(text) {
    return text
        .replace(/[\u0622\u0623\u0625\u0627]/g, 'ا') // Normalize different forms of "ا" to "ا"
        .replace(/[\u0649\u064A]/g, 'ي')             // Normalize "ى" and "ي" to "ي"
        .replace(/[\u0629]/g, 'ه')                   // Normalize "ة" to "ه"
        .replace(/[\u0624]/g, 'و')                   // Normalize "ؤ" to "و"
        .replace(/[\u0626]/g, 'ي');                  // Normalize "ئ" to "ي"
}

export function removeDiacritics(text) {
    //console.log(text)
    let textWithoutTashkeel = removeTashkeel(text)
    let txt =normalizeArabic(textWithoutTashkeel)
   // console.log(txt)
    return txt

}



