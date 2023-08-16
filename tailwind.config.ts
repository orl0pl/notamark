import type { Config } from 'tailwindcss'
const { withMaterialColors } = require('tailwind-material-colors');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
  darkMode: 'class',
  theme: {
    colors: {
      primary: "var(--md-sys-color-primary)",
      primarycontainer: "var(--md-sys-color-primary-container)",
      secondary: "var(--md-sys-color-secondary)",
      secondarycontainer: "var(--md-sys-color-secondary-container)",
      on: {
        primary: "var(--md-sys-color-on-primary)",
        primarycontainer: "var(--md-sys-color-on-primary-container)",
        secondary: "var(--md-sys-color-on-secondary)",
        secondarycontainer: "var(--md-sys-color-on-secondary-container)",
      }
    }
  }
}

 const configWithMaterialColors = withMaterialColors(config, {
  primary: '#519D5E',
})
export default require("tailwind-material-surfaces")(config, {
  
  surfacePrefix: "surface",
  interactiveSurfacePrefix: "interactive-surface",
})//WithMaterialColors
