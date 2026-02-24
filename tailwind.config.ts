import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: { extend: {
    backgroundImage: {
      marble: "url('/bg-marble.png')",
      paper: "url('/footer-paper.png')",
    },
    fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],         
        fraktur: ["var(--font-fraktur)", "cursive"],   
      },
  } },
  plugins: [],
} satisfies Config;
