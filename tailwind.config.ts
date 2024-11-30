import type { Config } from "tailwindcss";

const colors = {
  black: "#000000", 
  gray_primary: "#878787",
  gray_secondary: "#BCBCBC",
  blue_category: "#AACAFA",
  orange_category: "#F9DBA1",
  green_category: "#BBFAB5",
};

export default {

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        Anaheim: ["Pixelify Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), 
    require("@tailwindcss/typography"), 
    require("@tailwindcss/aspect-ratio"), 
  ],
} satisfies Config;

