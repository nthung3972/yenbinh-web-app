import AuthService from '~/services/auth.service';

export default defineNuxtPlugin(async () => {
  // Khôi phục phiên đăng nhập từ localStorage khi ứng dụng khởi động
  if (process.client) {
    await AuthService.restoreAuth();
  }
  
  return {
    provide: {
      auth: AuthService
    }
  };
});