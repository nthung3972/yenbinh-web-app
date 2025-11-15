import apiService from './api.service';
import { useAuthStore } from '~/stores/auth';
import { useLoadingStore } from '~/stores/loading';

class AuthService {
  async login(credentials) {
    const authStore = useAuthStore();
    try {
      const response = await apiService.post('/auth/login', credentials);
      const { token, user } = response.data.data;
      
      // Set token và user cùng lúc
      authStore.setToken(token);
      authStore.setUser(user);

      apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    const loadingStore = useLoadingStore();
    try {
      loadingStore.showLoading();
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        await apiService.post('/me/logout');
      }

      authStore.clearAuth();
      navigateTo('/auth/login');
    } catch (error) {
      console.error('Logout error');
      useAuthStore().clearAuth();
    } finally {
      loadingStore.hideLoading(); 
    }
  }

  isAuthenticated() {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  }

  isVerified() {
    const authStore = useAuthStore();
    return authStore.isEmailVerified;
  }

  async restoreAuth() {
    const authStore = useAuthStore();

    if (process.client) {
      const token = localStorage.getItem('auth_token');
      const expiry = localStorage.getItem('token_expiry');
      const userData = localStorage.getItem('auth_user');

      // Kiểm tra token hết hạn
      if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
        authStore.clearAuth();
        return false;
      }

      // Set token
      authStore.setToken(token);
      apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Parse và set user data từ localStorage
      if (userData) {
        try {
          authStore.setUser(JSON.parse(userData));
          return true; // ← Quan trọng: return true luôn nếu có userData
        } catch (e) {
          console.error('Failed to parse user data');
        }
      }

      // try {
      //   const response = await apiService.get('/me');
      //   authStore.setUser(response.data.data);
      //   return true;
      // } catch (error) {
      //   console.error('Failed to fetch user:', error);
      //   authStore.clearAuth();
      //   return false;
      // }
    }

    return false;
  }

  async fetchCurrentUser() {
    const authStore = useAuthStore();
    try {
      const response = await apiService.get('/me');
      authStore.setUser(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }
}

export default new AuthService();
