/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            shiki: {
            light: "var(--shiki-light)",
            "light-bg": "var(--shiki-light-bg)",
            dark: "var(--shiki-dark)",
            "dark-bg": "var(--shiki-dark-bg)",
            },
        },
      keyframes: {
        "typing-dot-bounce": {
          "0%, 40%": { transform: "translateY(0)" },
          "20%": { transform: "translateY(-0.25rem)" },
        },
      },
      animation: {
        "typing-dot-bounce": "typing-dot-bounce 1.25s ease-out infinite",
      },
    },
  },
  plugins: [],
}
