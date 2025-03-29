import apiService from './api.service';
import { useAuthStore } from '~/stores/auth';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      const { token, user } = response.data.data;

      const authStore = useAuthStore();
      authStore.setToken(token);
      authStore.setUser(user);

      apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
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
    }
  }

  isAuthenticated() {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  }

  async restoreAuth() {
    const authStore = useAuthStore();

    if (process.client) {
      const token = localStorage.getItem('auth_token');
      const expiry = localStorage.getItem('token_expiry');
      const userData = localStorage.getItem('auth_user');

      if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
        authStore.clearAuth();
        return false;
      }

      authStore.setToken(token);
      apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (userData) {
        try {
          authStore.setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data');
        }
      } else {
        try {
          await this.fetchCurrentUser();
        } catch (error) {
          this.logout();
        }
      }

      return true;
    }

    return false;
  }
}

export default new AuthService();
