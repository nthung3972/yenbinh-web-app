import AuthService from '~/services/auth.service';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { fetchInitialData } = useInitialData();

  // Route yêu cầu đăng nhập
  if (to.meta.requiresAuth !== false) {

    //restore nếu CHƯA CÓ cả token VÀ user
    if (!authStore.token || !authStore.user) {
      const restored = await AuthService.restoreAuth();
      if (!restored) {
        return navigateTo('/auth/login');
      }
    } else {
      // console.log('Already authenticated, skip restore');
    }

    // Kiểm tra verify email
    if (!authStore.user?.email_verified_at && to.path !== '/auth/verify-email') {
      return navigateTo('/auth/verify-email');
    }

    // Kiểm tra permission
    if (to.meta.permissions) {
      const ok = to.meta.permissions.some(p => authStore.hasPermission(p));
      if (!ok) {
        return navigateTo('/unauthorized');
      }
    }
  }
});
