/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    purge: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#104e8b',
                highlight: '#e7aa55',
                lightBg: '#ebe7e7',
                darkBg: '#333333',
                darkText: '#272a2b',
                lightText: '#6b6761',
            },
        },
    },
    plugins: [],
    fontFamily: {
        sans: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
};
