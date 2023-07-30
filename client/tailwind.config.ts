import { Config } from "tailwindcss"
import daisyUI from "daisyui"
import tailwindCss3D from "tailwindcss-3d"

const tailwindConfig: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // daisyUI config
  daisyui: {
    base: true, // applies background color and foreground color for root element by default
    darkTheme: "dark", // name of one of the included themes for dark mode
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    styled: true, // include daisyUI colors and design decisions for all components
    themes: ["cupcake"], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    utils: true, // adds responsive and modifier utility classes
  },

  plugins: [daisyUI, tailwindCss3D],
  theme: {
    extend: {
      animation: {
        "bg-gradient-slow": "bg-gradient 1500ms ease infinite",
        "fade-in": "fade-in 300ms ease-in-out",
      },
      backgroundSize: {
        "400%": "400%",
      },
      borderWidth: {
        "1": "1px",
      },
      boxShadow: {
        "inner-primary": "inset 0px 0px 24px 0px rgba(101, 195, 200, 1)",
        "inner-secondary": "inset 0px 0px 20px 0px rgba(239, 159, 188, 1)",
      },
      keyframes: {
        "bg-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
}

export default tailwindConfig
