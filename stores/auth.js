import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userProfile: (state) => state.user,
    userRoles: (state) => state.user?.roles || [],
    userPermissions: (state) => state.user?.permissions || []
  },
  
  actions: {
    setToken(token) {
      this.token = token;
      
      // Lưu token vào localStorage để duy trì phiên đăng nhập
      if (process.client) {
        localStorage.setItem('auth_token', token);
      }
    },
    
    setUser(user) {
      this.user = user;
      
      // Lưu thông tin user vào localStorage
      if (process.client && user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    },
    
    clearAuth() {
      this.token = null;
      this.user = null;
      
      // Xóa dữ liệu từ localStorage
      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    
    // Kiểm tra quyền hạn
    hasPermission(permission) {
      if (!this.user || !this.user.permissions) return false;
      return this.user.permissions.includes(permission);
    },
    
    // Kiểm tra vai trò
    hasRole(role) {
      if (!this.user || !this.user.roles) return false;
      return this.user.roles.includes(role);
    }
  }
});