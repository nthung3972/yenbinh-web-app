// services/auth.service.js
import apiService from './api.service';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

class AuthService {
  /**
   * Xử lý đăng nhập người dùng
   * @param {Object} credentials - Email và mật khẩu
   * @returns {Promise} - Trả về promise với kết quả đăng nhập
   */
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      console.log(response.data)
      
      const { token, user } = response.data.data;
      
      // Lưu token và thông tin user vào store
      const authStore = useAuthStore();
      authStore.setToken(token);
      authStore.setUser(user);
      
      // Thiết lập header Authorization cho các request API sau này
      apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng xuất người dùng
   */
  async logout() {
    try {
      const authStore = useAuthStore();
      const token = authStore.token;
      
      // Gọi API logout nếu cần
      if (token) {
        const response = await apiService.post('/me/logout');
      }
      
      // Xóa dữ liệu trong store
      authStore.clearAuth();
      
      // Chuyển hướng về trang login
      navigateTo("/auth/login");
    } catch (error) {
      console.error('Logout error:', error);
      
      // Xóa dữ liệu ngay cả khi API thất bại
      const authStore = useAuthStore();
      authStore.clearAuth();
    }
  }

  /**
   * Kiểm tra trạng thái đăng nhập
   * @returns {Boolean}
   */
  isAuthenticated() {
    const authStore = useAuthStore();
    return !!authStore.token;
  }

  /**
   * Phục hồi phiên đăng nhập từ localStorage
   */
  async restoreAuth() {
    const authStore = useAuthStore();
    
    if (process.client) {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');
      
      if (token) {
        authStore.setToken(token);
        apiService.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        if (userData) {
          try {
            authStore.setUser(JSON.parse(userData));
          } catch (e) {
            console.error('Failed to parse user data');
          }
        }
        
        // Nếu không có userData hoặc parse lỗi, fetch user data mới
        if (!userData) {
          try {
            await this.fetchCurrentUser();
          } catch (error) {
            // Token không hợp lệ, đăng xuất
            this.logout();
          }
        }
        
        return true;
      }
    }
    
    return false;
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  // async fetchCurrentUser() {
  //   try {
  //     const response = await apiService.get('/auth/me');
  //     const authStore = useAuthStore();
  //     authStore.setUser(response.data.user);
  //     return response.data.user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default new AuthService();
