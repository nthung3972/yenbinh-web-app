import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    expiry: null,
  }),
  
  getters: {
    // isAuthenticated: (state) => !!state.token,
    isAuthenticated: (state) => {
      if (!state.token || !state.expiry) return false;
      return new Date().getTime() < parseInt(state.expiry);

    },
    userProfile: (state) => state.user,
    userRoles: (state) => state.user?.roles || [],
    userPermissions: (state) => state.user?.permissions || []
  },
  
  actions: {
    setToken(token) {
      const expiryTime = new Date().getTime() + 60 * 60 * 1000;

      this.token = token;
      this.expiry = expiryTime.toString();
      
      if (process.client) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token_expiry', expiryTime.toString());
      }
    },
    
    setUser(user) {
      this.user = user;
      
      if (process.client && user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      this.expiry = null;
      
      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('token_expiry');
      }
    },

    checkTokenExpiry() {
      if (!this.token || !this.expiry) {
        this.clearAuth();
        return false;
      }

      const currentTime = new Date().getTime();
      if (currentTime > parseInt(this.expiry)) {
        this.clearAuth();
        return false;
      }

      return true;
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
