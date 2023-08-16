import type { Config } from 'tailwindcss'
const { withMaterialColors } = require('tailwind-material-colors');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      
    },
    
  },
  plugins: [],
}

const configWithMaterialColors = withMaterialColors(config, {
  primary: '#ff0000'
})
export default configWithMaterialColors
