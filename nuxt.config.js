export default defineNuxtConfig({
  ssr: false,
  css: [
    '~/assets/css/style.css',
    '~/assets/css/action-dropdown.css',
    'bootstrap/dist/css/bootstrap.min.css'
  ],
  app: {
    head: {
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js' },
      ],
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
  ], 
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "localhost:8000/api/admin",
      // apiUrl: process.env.NUXT_PUBLIC_API_URL || "https://yenbinh-serve-app-production.up.railway.app/api/admin",
    }
  },
  plugins: [
    '~/plugins/chart.js',
    '~/plugins/bootstrap.client.js',
    '~/plugins/unsavedChangesGuard.js'
  ],

  compatibilityDate: '2025-03-13'
});