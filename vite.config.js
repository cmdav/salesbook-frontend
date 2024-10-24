import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

let src = '/images/iSalesbook-Logo-Icon.png';

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'iSalesBook',
        short_name: 'iSales',
        description: 'Inventory App',
        theme_color: '#F58A07',
        icons: [
          {
            src: src,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: src,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },

      // Conditionally enable devOptions only in development mode
      ...(mode === 'development' && {
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      
      strategies: 'injectManifest',
      srcDir: '',
      filename: 'customSw.js',
      injectRegister: false,
      injectManifest: {
        injectionPoint: undefined,
        globPatterns: [
          '**/*.{js,css,html,png,jpg,jpeg,svg}', // Exclude customSw.js from caching
        ],
        globIgnores: ['customSw.js'], // Ensure that customSw.js is excluded from precaching
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
