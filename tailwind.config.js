/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@joseparedesc/master-crud/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10171F",
        paper: "#F6F7F5",
        surface: "#FFFFFF",
        mist: "#EDEFEC",
        line: "#E2E5E0",
        moss: "#1F6D5A",
        "moss-light": "#E7F3EF",
        clay: "#B4483A",
        "clay-light": "#F8E9E7",
        slate: "#5B6570",
        green: "#459745",
        blue: "#3e77c7",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(16, 23, 31, 0.06)",
        card: "0 4px 20px rgba(16, 23, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
