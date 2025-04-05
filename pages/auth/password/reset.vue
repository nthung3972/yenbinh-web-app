<template>
    <div class="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="card shadow p-4" style="max-width: 500px; width: 100%">
        <h3 class="text-center mb-4">Đặt lại mật khẩu</h3>
  
        <div v-if="passwordReset" class="alert alert-success text-center">
          Đặt lại mật khẩu thành công!
          <nuxt-link to="/auth/login" class="fw-semibold text-decoration-underline d-block mt-2">
            Đăng nhập ngay
          </nuxt-link>
        </div>
  
        <form v-else @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu mới</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Nhập mật khẩu mới"
            />
            <div v-if="errors?.password" class="form-text text-danger">
              {{ errors?.password[0] }}
            </div>
          </div>
  
          <div class="mb-4">
            <label for="password_confirmation" class="form-label">Xác nhận mật khẩu</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              placeholder="Nhập lại mật khẩu mới"
            />
            <div v-if="errors?.password_confirmation" class="form-text text-danger">
              {{ errors?.password_confirmation[0] }}
            </div>
          </div>
  
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="isLoading"
          >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <span v-else>Đặt lại mật khẩu</span>
          </button>
        </form>
      </div>
    </div>
  </template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref, reactive, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// Lấy token và email từ query parameters
const token = ref(route.query.token || '');
const email = ref(decodeURIComponent(route.query.email || ''));

const form = reactive({
    password: '',
    password_confirmation: '',
});

const errors = ref({});
const isLoading = ref(false);
const passwordReset = ref(false);

// Kiểm tra token và email khi trang được tải
onMounted(() => {
    // Nếu không có token hoặc email, chuyển hướng đến trang lỗi
    if (!token.value || !email.value) {
        router.push('/auth/password/reset-error');
    }
});

const submitForm = async () => {
    errors.value = {};
    isLoading.value = true;

    try {
        await userStore.resetPassword({
            token: token.value,
            email: email.value,
            password: form.password,
            password_confirmation: form.password_confirmation,
        });

        // Hiển thị thông báo thành công
        passwordReset.value = true;
    } catch (error) {
        if (error.errors) {
            errors.value = error.errors;
            console.log(errors.value);
        } else {
            router.push('/auth/password/reset-error');
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
