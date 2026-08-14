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
      "garden-ground": "rgb(var(--garden-ground-rgb) / <alpha-value>)",
      "pale-mineral": "rgb(var(--pale-mineral-rgb) / <alpha-value>)",
      "sky-blue": "rgb(var(--sky-blue-rgb) / <alpha-value>)",
      "rain-ink": "rgb(var(--rain-ink-rgb) / <alpha-value>)",
      ember: "rgb(var(--ember-rgb) / <alpha-value>)",
      "ember-ink": "rgb(var(--ember-ink-rgb) / <alpha-value>)",
      "moss-veil": "rgb(var(--moss-veil-rgb) / <alpha-value>)",
      "black-flower": "rgb(var(--black-flower-rgb) / <alpha-value>)",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-figtree)", "sans-serif"],
        sans: ["var(--font-figtree)", "sans-serif"],
      },
      borderRadius: {
        card: "4px",
        btn: "3px",
      },
      boxShadow: {
        matte: "var(--shadow-matte)",
        soft: "0 1px 0 rgb(var(--garden-ground-rgb) / 0.14)",
        lifted: "var(--shadow-matte)",
      },
    },
  },
  plugins: [],
};

export default config;
