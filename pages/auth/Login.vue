<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Đăng nhập vào hệ thống
          </h2>
        </div>
        
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
            </div>
          </div>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Mật khẩu</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Mật khẩu"
              />
            </div>
          </div>
  
          <div class="flex items-center justify-between">
            <div class="text-sm">
              <NuxtLink to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                Quên mật khẩu?
              </NuxtLink>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              <span v-if="loading" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <!-- Spinner icon -->
                <svg class="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
          </div>
        </form>
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
      
      // Lấy URL chuyển hướng nếu có
      const redirectPath = route.query.redirect || '/dashboard';
      
      // Hiển thị thông báo thành công (tùy chọn)
      // toast.success('Đăng nhập thành công');
      
      // Chuyển hướng sau khi đăng nhập thành công
      router.push(redirectPath);
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