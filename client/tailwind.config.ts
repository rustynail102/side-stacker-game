import { Config } from "tailwindcss"
import daisyUI from "daisyui"

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

  plugins: [daisyUI],
  theme: {
    extend: {},
  },
}

export default tailwindConfig
