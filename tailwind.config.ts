import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      cream: "rgb(var(--cream-rgb) / <alpha-value>)",
      sage: "rgb(var(--sage-rgb) / <alpha-value>)",
      moss: "rgb(var(--moss-rgb) / <alpha-value>)",
      "light-sage": "rgb(var(--light-sage-rgb) / <alpha-value>)",
      "dark-earth": "rgb(var(--dark-earth-rgb) / <alpha-value>)",
      "earth-ink": "rgb(var(--earth-ink-rgb) / <alpha-value>)",
      blush: "rgb(var(--blush-rgb) / <alpha-value>)",
      terracotta: "rgb(var(--terracotta-rgb) / <alpha-value>)",
      "warm-stone": "rgb(var(--warm-stone-rgb) / <alpha-value>)",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-dm-serif)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "10px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(104, 96, 77, 0.10)",
        lifted: "0 4px 20px rgba(104, 96, 77, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
