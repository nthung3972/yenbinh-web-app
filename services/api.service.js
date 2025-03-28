import axios from "axios";
import { useAuthStore } from "~/stores/auth";

class ApiService {
  constructor() {
    this.$http = null;
    this.$baseURL = null;
    this.router = null;
  }

  // Khởi tạo service
  init(options = {}) {
    const config = useRuntimeConfig();
    const baseURL = options.url || config.public.apiUrl;

    // Tạo instance Axios
    this.$http = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.$baseURL = baseURL;

    // Lưu trữ router từ bên ngoài
    this.router = options.router;

    // Thêm interceptor xử lý response
    this.$http.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );

    // Thêm interceptor xử lý request
    this.$http.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => Promise.reject(error)
    );
  }

  // Xử lý lỗi API
  handleError(error) {
    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject(error);
    }

    const statusCode = error.response.status;

    // Kiểm tra xem router có tồn tại không
    if (!this.router) {
      console.error("Router not initialized");
      return Promise.reject(error);
    }

    // Sử dụng Pinia store
    const authStore = useAuthStore();

    switch (statusCode) {
      case 401:
        console.log("Lỗi api:", statusCode);
        
        // Đăng xuất người dùng
        authStore.logout();
        
        // Chuyển hướng đến trang đăng nhập
        this.router.push('/auth/login');
        break;

      case 500:
        this.router.push({
          path: "/error",
          query: { 
            statusCode: 500, 
            message: error.response.data.message 
          },
        });
        break;

      case 404:
        this.router.push("/404");
        break;
    }

    return Promise.reject(error.response.data || error);
  }

  // Xử lý request (tự động thêm token)
  handleRequest(config) {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  }

  // Các phương thức HTTP
  get(resource, params = {}) {
    return this.$http.get(resource, { params });
  }

  post(resource, data = {}) {
    return this.$http.post(resource, data);
  }

  put(resource, data = {}) {
    return this.$http.put(resource, data);
  }

  patch(resource, data = {}) {
    return this.$http.patch(resource, data);
  }

  delete(resource) {
    return this.$http.delete(resource);
  }
}

// Tạo singleton instance
const apiService = new ApiService();

export default apiService;