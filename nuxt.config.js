export default defineNuxtConfig({
  ssr: false,
  css: [
    '~/assets/css/style.css',
    '~/assets/css/action-dropdown.css',
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  app: {
    head: {
      title: 'Yên Bình',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { hid: 'og:image', property: 'og:image', content: 'https://yenbinhmanagement.vn/logo-yenbinh.png' },
        { hid: 'og:title', property: 'og:title', content: 'Yên Bình' },
        { hid: 'og:description', property: 'og:description', content: 'Phần mềm quản lý tòa nhà chung cư Yên Bình' },
        { hid: 'og:url', property: 'og:url', content: 'https://yenbinhmanagement.vn/' },
        { hid: 'og:type', property: 'og:type', content: 'webapp' }
      ],
      link: [
        { rel: "icon", type: 'image/x-icon', href: "/logo-yb.png" },
      ],
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
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "https://api.yenbinhmanagement.vn/api/admin",
    }
  },
  plugins: [
    '~/plugins/chart.js',
    '~/plugins/bootstrap.client.js',
    '~/plugins/unsavedChangesGuard.js'
  ],

  compatibilityDate: '2025-03-13'
});