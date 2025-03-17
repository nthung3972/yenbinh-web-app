import AuthService from '~/services/auth.service';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Kiểm tra nếu route yêu cầu authentication
  if (to.meta.requiresAuth !== false) {
    // Kiểm tra trạng thái đăng nhập
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      // Kiểm tra xem có thể khôi phục phiên đăng nhập từ localStorage không
      const restored = await AuthService.restoreAuth();
      
      if (!restored) {
        // Chuyển hướng đến trang đăng nhập nếu không thể khôi phục
        return navigateTo({
          path: '/auth/login',
          query: { redirect: to.fullPath }
        });
      }
    }
    
    // Kiểm tra quyền hạn nếu route yêu cầu
    if (to.meta.permissions) {
      const authStore = useAuthStore();
      const hasPermission = to.meta.permissions.some(permission => 
        authStore.hasPermission(permission)
      );
      
      if (!hasPermission) {
        // Chuyển hướng đến trang không có quyền truy cập
        return navigateTo('/unauthorized');
      }
    }
  }
});