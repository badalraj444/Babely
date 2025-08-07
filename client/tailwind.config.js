/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
  'light-chat-theme',
  'dark-chat-theme'
],
  theme: {
    extend: {fontFamily: {
      wire: ['ui-mono', 'Courier New', 'monospace'],
    },
},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "forest",
      "wireframe",
    ],
  },
}
