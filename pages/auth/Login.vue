<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg p-4" style="width: 400px;">
      <div class="card-body">
        <h2 class="text-center mb-4">Đăng nhập vào hệ thống</h2>

        <!-- Hiển thị lỗi -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Nhập email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div class="d-flex justify-content-between">
            <NuxtLink to="/forgot-password" class="text-decoration-none">
              Quên mật khẩu?
            </NuxtLink>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AuthService from '~/services/auth.service';
  
  // Khai báo reactive form data
  const form = reactive({
    email: '',
    password: '',
  });
  
  const loading = ref(false);
  const errorMessage = ref('');
  const router = useRouter();
  const route = useRoute();
  
  // Xử lý form submit
  const handleLogin = async () => {
    try {
      loading.value = true;
      errorMessage.value = '';
      
      // Gọi auth service để xử lý đăng nhập
      await AuthService.login({
        email: form.email,
        password: form.password
      });
      
      // Hiển thị thông báo thành công (tùy chọn)
      // toast.success('Đăng nhập thành công');
      
      // Chuyển hướng sau khi đăng nhập thành công
      return navigateTo('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 401) {
        errorMessage.value = 'Email hoặc mật khẩu không chính xác';
      } else if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = 'Đã xảy ra lỗi khi đăng nhập';
      }
    } finally {
      loading.value = false;
    }
  };
  
  // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng về trang dashboard
  onMounted(async () => {
    if (AuthService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      // Thử khôi phục phiên đăng nhập từ token lưu trữ
      const restored = await AuthService.restoreAuth();
      if (restored) {
        const redirectPath = route.query.redirect || '/dashboard';
        router.push(redirectPath);
      }
    }
  });
  
  // Đảm bảo meta của route không yêu cầu xác thực
  definePageMeta({
    requiresAuth: false
  });
  </script>