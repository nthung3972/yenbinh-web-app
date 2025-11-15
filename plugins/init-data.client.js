export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchInitialData } = useInitialData();
  
  // Chỉ fetch 1 lần khi app khởi động
  if (process.client) {
    await fetchInitialData();
  }
});
