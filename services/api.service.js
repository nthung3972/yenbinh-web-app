import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.$baseURL = baseURL;

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
    const authStore = useAuthStore();

    if (statusCode === 401) {
      authStore.logout();
      router.push("/auth/login");
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