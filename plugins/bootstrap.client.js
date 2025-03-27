import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.globalProperties.$bootstrap = bootstrap
})
