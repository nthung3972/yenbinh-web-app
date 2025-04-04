import AuthService from '~/services/auth.service'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Kiểm tra nếu route yêu cầu authentication
  if (to.meta.requiresAuth !== false) {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      const restored = await AuthService.restoreAuth();
      if (!restored) {
        return navigateTo('/auth/login');
      }
    }

    const user = authStore.user;
    if (user?.email_verified_at === null && to.path !== '/auth/verify-email') {
      return navigateTo('/auth/verify-email');
    }

    if (to.meta.permissions) {
      const hasPermission = to.meta.permissions.some(permission =>
        authStore.hasPermission(permission)
      );

      if (!hasPermission) {
        return navigateTo('/unauthorized');
      }
    }
  }
});
