import AuthService from '~/services/auth.service';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Kiểm tra nếu route yêu cầu authentication
  if (to.meta.requiresAuth !== false) {
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      const restored = await AuthService.restoreAuth();
      
      if (!restored) {
        return navigateTo('/auth/login')
      }
    }
    
    if (to.meta.permissions) {
      const authStore = useAuthStore();
      const hasPermission = to.meta.permissions.some(permission => 
        authStore.hasPermission(permission)
      );
      
      if (!hasPermission) {
        return navigateTo('/unauthorized');
      }
    }
  }
});