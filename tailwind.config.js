/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        gray: {
          150: "#eef1f5", // Extra claro para tema light
          // Nueva escala de grises personalizada - tema oscuro
          910: "#191F2A", // +10% oscuridad
          905: "#1D2430", // +5% oscuridad
          900: "#212936", // Color base
          870: "#262E3C", // -5% claridad
          850: "#2B3442", // -10% claridad
          // Nueva escala de grises personalizada - tema claro
          50: "#FFFFFF", // Color base (blanco)
          100: "#F2F2F2", // -5% luminosidad
          200: "#E6E6E6", // -10% luminosidad
          300: "#D9D9D9", // -15% luminosidad
          400: "#D6D6D6", // Tono oscuro para contraste
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
