// src/translateService.js
import axios from "axios";


export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "ar", // Source language (English)
          tl: targetLanguage, // Target language
          dt: "t",
          q: text,
        },
      }
    );

    // The API returns an array of arrays; extract the translated text.
    const translatedText = response.data[0][0][0];
    return translatedText;
  } catch (error) {
    // console.error("Error translating text:", error);

    return "";
  }
};

// format way to show
export const formatDataForDisplay = (data, type) => {
  // Filter out objects where the value is empty
  const filteredData = data.filter((item) => item.value.trim() !== "");

  // If no data remains after filtering, return "No data today"
  if (filteredData.length === 0) {
    return "No data today";
  }

  // Format each object with a label: value style and separate with new lines
  return filteredData
    .map((item) => `${item.label} :::: ${item.value}`)
    .join("\n "); // Separate different objects with new lines
};



 