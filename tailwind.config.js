import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                canvas: { ice: '#fbfdf6' },
                adaline: { ink: '#0a1d08' },
                mist: { gray: '#c5ccb6' },
                deep: { earth: '#31200b' },
                valley: { green: '#203b14' },
                stone: { moss: '#e0e5d5' },
                amber: { seed: '#4a3212' },
                forest: { dew: '#d7e8b5' },
                blackest: { night: '#000000' },
            },
            fontFamily: {
                sans: ['var(--font-akkurat)', ...defaultTheme.fontFamily.sans],
                mono: ['var(--font-fragmentmono)', ...defaultTheme.fontFamily.mono],
            },
            borderRadius: {
                images: '8px',
                buttons: '20px',
                navItems: '20px',
            },
        },
    },

    plugins: [forms],
};
