import axios from "axios";
import { useAuthStore } from "~/stores/auth"
import { useRouter } from "vue-router"
import AuthService from '~/services/auth.service'

class ApiService {
  constructor() {
    this.$http = null;
    this.$baseURL = null;
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
        // Accept: "application/json",
      },
    });

    this.$baseURL = baseURL;

    // Thêm interceptor để tự động đặt Content-Type phù hợp
    this.$http.interceptors.request.use(config => {
      // Nếu dữ liệu là FormData (chứa file), không đặt Content-Type
      // Axios sẽ tự động đặt thành 'multipart/form-data' và thêm boundary
      if (config.data instanceof FormData) {
        // Xóa Content-Type để Axios tự xử lý
        delete config.headers['Content-Type'];
      } else {
        // Cho các request JSON thông thường
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    });

    this.$http.interceptors.response.use(
      (response) => {
        // Không xử lý đặc biệt nếu responseType là blob
        if (response.config.responseType === 'blob') {
          return response;
        }
        return response;
      },
      (error) => this.handleError(error)
    );

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
    const router = useRouter();

    if (statusCode === 401) {
      console.log("Hết thời hạn đăng nhập:", statusCode)
      AuthService.logout();

      const authStore = useAuthStore();
      if (!authStore.token) {
        return Promise.reject(error);
      }
    } else if (statusCode === 500) {
      router.push({
        path: "/error",
        query: { statusCode: 500, message: error.response.data.message },
      });
    } else if (statusCode === 404) {
      router.push("/404");
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

  // Phương thức GET
  get(resource, params = {}) {
    return this.$http.get(resource, { params });
  }

  // Phương thức POST
  post(resource, data = {}) {
    return this.$http.post(resource, data);
  }

  // Phương thức PUT
  put(resource, data = {}) {
    return this.$http.put(resource, data);
  }

  // Phương thức PATCH
  patch(resource, data = {}) {
    return this.$http.patch(resource, data);
  }

  // Phương thức DELETE
  delete(resource) {
    return this.$http.delete(resource);
  }
}

// Tạo singleton instance
const apiService = new ApiService();

export default apiService;
