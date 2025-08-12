/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: [''], // Amiri for Arabic
        yeseva: ["Yeseva One", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: "20px",
      },
      colors: {
        PrimaryColor: "#00CDD7",
        textColor: "#242F6C",
        bgColor: "#ECFBF9",
        PargraphColor: "#777",
        PrimaryButtonColor: "#155E75",
        SecondaryButtonColor: "#22D3EE",
      },
    },
  },
 plugins: [
    function({ addBase }) {
      addBase({
        'body': { fontFamily: 'Poppins, sans-serif' },
        'h1, h2, h3, h4, h5, h6': { fontFamily: 'Yeseva One, sans-serif' },
      });
    },
  ],
};
