import type { Config } from "tailwindcss";
import { designSystemTheme } from "./lib/design-system/tailwind-theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: designSystemTheme,
  },
  plugins: [],
};

export default config;
