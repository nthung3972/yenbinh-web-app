<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center">
        <div class="card shadow border-0 p-4 p-md-5 text-center" style="max-width: 500px;">
            <!-- Header với icon -->
            <div class="mb-4">
                <i class="bi bi-envelope-check fs-1 text-primary"></i>
            </div>

            
            <h1 class="card-title mb-3">Xác Thực Email</h1>

            <div class="card-body px-0">
                <p class="text-muted mb-4">
                    Chúng tôi đã gửi một email xác nhận đến địa chỉ email của bạn.
                    Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết xác nhận.
                </p>

                <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <i class="bi bi-info-circle me-2"></i>
                    <div>
                        Nếu bạn không tìm thấy email trong hộp thư đến, vui lòng kiểm tra thư mục spam.
                    </div>
                </div>

                <button class="btn btn-primary w-100 py-2" @click="resendEmail" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    {{ isLoading ? 'Đang gửi...' : 'Gửi lại email xác nhận' }}
                </button>

                <div v-if="successMsg" class="alert alert-success mt-3" role="alert">
                    {{ successMsg }}
                </div>

                <div v-if="errorMsg" class="alert alert-danger mt-3" role="alert">
                    {{ errorMsg }}
                </div>

                <div class="mt-4">
                    <p class="text-muted small mb-0">
                        Bạn cần hỗ trợ? <a href="#" class="text-decoration-none">Liên hệ với chúng tôi</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <button @click="logout()">Logout</button>
</template>

<script setup>
import AuthService from '~/services/auth.service'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

definePageMeta({
    middleware: "auth",
    //   layout: "dashboard"
})

const isLoading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const userStore = useUserStore()

const resendEmail = async () => {
    isLoading.value = true
    try {
        const response = await userStore.resendEmailVerification()
        if (response) {
            successMsg.value = 'Email xác nhận đã được gửi lại thành công'
        }
    } catch (error) {
        errorMsg.value = 'Có lỗi xảy ra, vui lòng thử lại sau'
    } finally {
        isLoading.value = false
    }
};


const logout = async () => {
    try {
        await AuthService.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }
}
</script>