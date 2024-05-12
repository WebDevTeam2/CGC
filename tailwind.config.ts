import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobile: "360px", // Mobile devices
      tablet: "768px", // Tablets
      laptop: "1024px", // Laptops
      desktop: "1280px", // Desktops
      wide: "1440px", // Wider screens
      tv: "1920px", // Large TVs
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      sans: ["open-sans", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
export default config;
