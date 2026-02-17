import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: { extend: {
    backgroundImage: {
      marble: "url('/bg-marble.png')",
      paper: "url('/footer-paper.png')",
    },
  } },
  plugins: [],
} satisfies Config;
