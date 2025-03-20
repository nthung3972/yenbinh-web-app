export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8000/api/admin",
    }
  },
  plugins: [
    '~/plugins/chart.js'
  ],
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],

  compatibilityDate: '2025-03-13'
});