import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { copy } from 'vite-plugin-copy'; // Import the plugin using named export

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        copy({
            targets: [
                { src: 'resources/css', dest: 'public' }, // Copy resources/css to public/css
                { src: 'resources/fonts', dest: 'public' }, // Copy resources/fonts to public/fonts
                { src: 'resources/images', dest: 'public' }, // Copy resources/images to public/images
                // { src: 'resources/js', dest: 'public' }, // Vite handles js bundling
                // { src: 'resources/scss', dest: 'public' }, // Vite handles scss bundling
                // Add more targets for other directories if needed
            ],
            // Options:
            // verbose: true // Optional: log copied files
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // Ini sudah benar
        hmr: {
            // host: '10.42.0.1', // Ganti dengan IP lokal komputer Anda
            host: '0.0.0.0',
        },
    },
});
