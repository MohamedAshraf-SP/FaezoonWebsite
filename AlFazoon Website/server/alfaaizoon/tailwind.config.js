/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "20px",
      },
      colors: {
        PrimaryColor: "#00CDD7",
        textColor: "#062265",
        bgColor: "#ECFBF9",
        PargraphColor: "#777",
        PrimaryButtonColor: "#155E75",
        SecondaryButtonColor: "#22D3EE",
      },
    },
  },
  plugins: [],
};
