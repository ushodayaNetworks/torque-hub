import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        buy: resolve(__dirname, 'buy.html'),
        sell: resolve(__dirname, 'sell.html'),
        contact: resolve(__dirname, 'contact.html'),
        help: resolve(__dirname, 'help.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        profile: resolve(__dirname, 'profile.html'),
        carDetails: resolve(__dirname, 'car-details.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
