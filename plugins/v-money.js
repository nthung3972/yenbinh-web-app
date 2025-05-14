import { VMoney } from 'v-money';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.directive('money', VMoney);
  }
});
