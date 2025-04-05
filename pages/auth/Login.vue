<!-- pages/login.vue -->
<template>
  <div class="container-fluid vh-100 p-0">
    <div class="row h-100 g-0">
      <div class="col-md-6 d-none d-md-block bg-image">
      </div>

      <div class="col-md-6 bg-light-blue">
        <div class="login-container d-flex flex-column justify-content-center align-items-center h-100">
          <div class="login-form-container bg-light shadow-lg rounded">
            <div class="text-center mb-4">
              <img src="/images/logo-yb.png" alt="Logo" class="logo mb-4" width="100">
              <h2 class="fw-bold">Đăng nhập</h2>
              <p class="text-muted">Vui lòng nhập thông tin đăng nhập của bạn</p>
            </div>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
            <!-- Form đăng nhập -->
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group shadow-sm">
                  <span class="input-group-text">
                    <Icon name="mdi:email-outline" />
                  </span>
                  <input type="email" class="form-control" id="email" placeholder="Nhập email của bạn"
                    v-model="form.email" required>
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Mật khẩu</label>
                </div>
                <div class="input-group shadow-sm">
                  <span class="input-group-text">
                    <Icon name="mdi:lock-outline" />
                  </span>
                  <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password"
                    placeholder="Nhập mật khẩu của bạn" v-model="form.password" required>
                  <span class="input-group-text" @click="showPassword = !showPassword">
                    <Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
                  </span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
              </button>

              <!-- <button type="submit" class="btn btn-primary w-100 py-2 mb-3">Đăng nhập</button> -->

              <div class="text-center mb-3">
                <span class="divider">hoặc đăng nhập với</span>
              </div>

              <!-- Nút đăng nhập xã hội -->
              <div class="d-flex justify-content-between gap-2 mb-4">
                <button type="button" class="btn btn-outline-secondary flex-grow-1 flex">
                  <Icon name="devicon:google" class="text-white" />Google
                </button>
                <button type="button" class="btn btn-outline-secondary flex-grow-1 flex">
                  <Icon name="devicon:facebook" class="text-white" />Facebook
                </button>
              </div>

              <div class="text-center">
                <nuxt-link to="/auth/password/forgot" class="small text-decoration-none">
                  Quên mật khẩu?
                </nuxt-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthService from '~/services/auth.service';

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const route = useRoute();
const showPassword = ref(false);

// Xử lý form submit
const handleLogin = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    // Gọi auth service để xử lý đăng nhập
    const response = await AuthService.login({
      email: form.email,
      password: form.password
    });

    console.log(response.data.user.email_verified_at)

    if (!response.data.user.email_verified_at) {
      // Email chưa xác thực, chuyển sang trang verify
      return navigateTo('/auth/verify-email');
    }

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

<style scoped>
/* Cài đặt hình ảnh bên trái */
.bg-image {
  background-image: url('/images/login-left.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Nền xanh nhạt cho phần bên phải */
.bg-light-blue {
  background-color: #e6f7ff;
  /* Màu xanh nhạt */
  /* Hoặc bạn có thể sử dụng gradients */
  background-image: linear-gradient(120deg, #e0f7fa, #bbdefb);
}

/* Container của form đăng nhập */
.login-form-container {
  width: 100%;
  max-width: 450px;
  padding: 20px 40px;
}

/* Đường phân cách "hoặc đăng nhập với" */
.divider {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
  width: 100%;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #dee2e6;
  margin: 0 10px;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .login-form-container {
    max-width: 100%;
    padding: 15px;
  }
}
</style>