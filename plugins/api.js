
import ApiService from "~/services/api.service";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig(); // Lấy biến môi trường đúng cách
  console.log("API URL:", config.public.apiUrl)

  // Khởi tạo ApiService với URL từ runtimeConfig
  ApiService.init({
    url: config.public.apiUrl,
  });

  return {
    provide: {
      api: ApiService,
    },
  };
});
