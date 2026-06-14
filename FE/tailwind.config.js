/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        mist: "#f5f7fa",
        leaf: "#2f7d62",
        clay: "#b8563f",
        line: "#d9e2ec"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};
