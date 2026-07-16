/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#D97706",
        secondary:"#14532D",
      },
      fontFamily:{
        poppins:["poppins","sans-serif"],
        averia:["Averia Serif Libre","serif"],
      },
      container:{
        center:true,
        padding:{
          dEFAULT:"1rem",
          sm:"2rem",
          lg:"4rem",
          xl:"5rem",
          "2xl":"6rem",
        },
      },
    },
  },
  plugins: [],
}