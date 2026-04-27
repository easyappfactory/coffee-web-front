import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#75584d",
          dark: "#5b4137",
        },
        surface: "#f9f9f9",
        card: "#ffffff",
        ink: {
          1: "#1a1c1e",
          2: "#444748",
          3: "#504442",
          muted: "#857370",
        },
        border: "rgba(211,195,192,0.3)",
        gray: {
          light: "#f7f7f7",
          line: "#c4c6cf",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        card: "8px",
        inner: "12px",
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0,0,0,0.05)",
        md: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
