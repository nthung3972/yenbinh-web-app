<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <h2 class="card-title text-center mb-4">Quên mật khẩu</h2>
              
              <div v-if="!emailSent">
                <p class="text-muted mb-4">
                  Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi email với hướng dẫn để đặt lại mật khẩu của bạn.
                </p>
  
                <form @submit.prevent="sendResetRequest">
                  <div class="form-floating mb-4">
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="email" 
                      placeholder="name@example.com" 
                      required
                    >
                    <label for="email">Địa chỉ email</label>
                  </div>
  
                  <button 
                    type="submit" 
                    class="btn btn-primary w-100 py-2" 
                    :disabled="loading || !isValidEmail"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Gửi yêu cầu
                  </button>
                </form>
              </div>
              
              <div v-else class="text-center">
                <div class="mb-4">
                  <i class="bi bi-envelope-check fs-1 text-success"></i>
                </div>
                <h4 class="mb-3">Đã gửi email!</h4>
                <p class="text-muted mb-4">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến 
                  <strong>{{ email }}</strong>. Vui lòng kiểm tra hộp thư của bạn.
                </p>
                
                <div class="d-flex flex-column gap-2">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary" 
                    :disabled="loading || resendCountdown > 0"
                    @click="resendResetRequest"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span v-if="resendCountdown > 0">
                      Gửi lại sau {{ resendCountdown }} giây
                    </span>
                    <span v-else>
                      <i class="bi bi-arrow-repeat me-1"></i>Gửi lại email
                    </span>
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-link text-decoration-none"
                    @click="resetForm"
                  >
                    Dùng email khác
                  </button>
                </div>
              </div>
  
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onUnmounted } from 'vue';
  import { useUserStore } from '@/stores/user'
  
  // Form state
  const email = ref('');
  const emailSent = ref(false);
  const loading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const resendCountdown = ref(0);
  const userStore = useUserStore();
  
  // Countdown timer
  let countdownInterval = null;
  
  // Computed properties
  const isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.value);
  });
  
  // Form submission functions
  const sendResetRequest = async () => {
    if (!isValidEmail.value) return;
    
    try {
      loading.value = true;
      errorMessage.value = '';

      await userStore.forgotPasswordRequest({ email: email.value });
      emailSent.value = true;
      startResendCountdown();
      
    } catch (error) {
      errorMessage.value = 'Đã xảy ra lỗi, vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.';
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const resendResetRequest = async () => {
    if (resendCountdown.value > 0) return;
    
    try {
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      await userStore.resendForgotPassword({ email: email.value });
      
      successMessage.value = 'Email đặt lại mật khẩu đã được gửi lại.';
      
      startResendCountdown();
      
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
      
    } catch (error) {
      errorMessage.value = 'Không thể gửi lại email. Vui lòng thử lại sau.';
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  // Reset form
  const resetForm = () => {
    emailSent.value = false;
    email.value = '';
    errorMessage.value = '';
    successMessage.value = '';
    clearInterval(countdownInterval);
    resendCountdown.value = 0;
  };
  
  // Countdown timer
  const startResendCountdown = () => {
    clearInterval(countdownInterval);
    resendCountdown.value = 60; // 60 giây
    
    countdownInterval = setInterval(() => {
      if (resendCountdown.value > 0) {
        resendCountdown.value--;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);
  };
  
  // Dọn dẹp khi component unmount
  onUnmounted(() => {
    clearInterval(countdownInterval);
  });
  </script>
  
  <style scoped>
  .card {
    transition: all 0.3s ease;
  }
  </style>