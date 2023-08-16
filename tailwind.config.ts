import type { Config } from 'tailwindcss'
const { withMaterialColors } = require('tailwind-material-colors');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    
  },
  plugins: [],
  darkMode: 'class',
}

 const configWithMaterialColors = withMaterialColors(config, {
  primary: '#519D5E',
})
export default config//WithMaterialColors
