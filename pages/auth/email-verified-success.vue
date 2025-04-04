<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center">
        <div class="card shadow border-0 p-4 p-md-5 text-center" style="max-width: 500px;">
            <!-- Icon thành công -->
            <div class="mb-4">
                <div class="bg-success bg-opacity-10 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style="width: 80px; height: 80px;">
                    <i class="bi bi-check-circle-fill fs-1 text-success"></i>
                </div>
            </div>

            <h1 class="card-title fw-bold mb-3 text-success">Xác minh thành công!</h1>

            <div class="card-body px-0">
                <p class="text-muted mb-4">
                    Địa chỉ email của bạn đã được xác minh thành công.
                    Bây giờ bạn có thể sử dụng đầy đủ các tính năng của tài khoản.
                </p>

                <button class="btn btn-primary w-100 py-2" @click="logout" :disabled="isLoading">
                    Đăng nhập lại
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import AuthService from '~/services/auth.service'

const logout = async () => {
    try {
        await AuthService.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }
}
</script>