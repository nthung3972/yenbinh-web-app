export default defineNuxtConfig({
  ssr: true,
  css: [
    '~/assets/css/style.css',
    'bootstrap/dist/css/bootstrap.min.css'
  ],
  app: {
    head: {
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js' },
      ],
    },
  },
  modules: ['@pinia/nuxt', '@nuxt/icon'], 
  runtimeConfig: {
    public: {
      // apiUrl: process.env.NUXT_PUBLIC_API_URL || "localhost:8000/api/admin",
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "https://yenbinhmanagement.vn/api/admin",
    }
  },
  plugins: [
    '~/plugins/chart.js',
    '~/plugins/bootstrap.client.js',
    '~/plugins/unsavedChangesGuard.js'
  ],

  compatibilityDate: '2025-03-13'
});