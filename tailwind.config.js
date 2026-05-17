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
                canvas: { ice: 'var(--color-canvas-ice)' },
                adaline: { ink: 'var(--color-adaline-ink)' },
                mist: { gray: 'var(--color-mist-gray)' },
                deep: { earth: 'var(--color-deep-earth)' },
                valley: { green: 'var(--color-valley-green)' },
                stone: { moss: 'var(--color-stone-moss)' },
                amber: { seed: 'var(--color-amber-seed)' },
                forest: { dew: 'var(--color-forest-dew)' },
                blackest: { night: 'var(--color-blackest-night)' },
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
