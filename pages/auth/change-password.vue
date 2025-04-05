<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow border-0 rounded-4">
                    <div class="card-body p-4 p-md-5">
                        <h2 class="card-title text-center mb-4">Đổi mật khẩu</h2>

                        <div v-if="!otpStep">
                            <!-- Form đổi mật khẩu -->
                            <form @submit.prevent="submitChangePassword">
                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control" id="currentPassword"
                                        v-model="dataForm.current_password" placeholder="Mật khẩu hiện tại" required>
                                    <label for="currentPassword">Mật khẩu hiện tại</label>
                                </div>

                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control" id="newPassword"
                                        v-model="dataForm.new_password" placeholder="Mật khẩu mới" required>
                                    <label for="newPassword">Mật khẩu mới</label>
                                </div>

                                <div class="form-floating mb-4">
                                    <input type="password" class="form-control" id="confirmPassword"
                                        v-model="dataForm.new_password_confirmation" placeholder="Xác nhận mật khẩu mới"
                                        required>
                                    <label for="confirmPassword">Xác nhận mật khẩu mới</label>
                                    <div v-if="!isPasswordMatch && dataForm.new_password_confirmation"
                                        class="text-danger small mt-1">
                                        Mật khẩu xác nhận không khớp
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary w-100 py-2"
                                    :disabled="loading || !isPasswordMatch">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                        aria-hidden="true"></span>
                                    Đổi mật khẩu
                                </button>
                            </form>
                        </div>

                        <div v-else>
                            <!-- OTP verification form -->
                            <div class="text-center mb-4">
                                <div class="mb-2">
                                    <i class="bi bi-envelope-check fs-1 text-primary"></i>
                                </div>
                                <h5>Nhập mã xác nhận</h5>
                                <p class="text-muted small">Mã xác nhận đã được gửi đến email của bạn</p>
                            </div>

                            <form @submit.prevent="verifyOTP">
                                <div class="mb-4">
                                    <div class="d-flex justify-content-between gap-2">
                                        <input v-for="(digit, index) in 6" :key="index" type="text" maxlength="1"
                                            class="form-control text-center fw-bold fs-5" v-model="otpDigits[index]"
                                            @input="moveToNext($event, index)"
                                            @keydown.delete="handleDelete($event, index)"
                                            @keydown.backspace="handleDelete($event, index)" @paste="handlePaste"
                                            ref="otpInputs">
                                    </div>
                                    <div class="text-center mt-3">
                                        <button type="button" class="btn btn-link text-decoration-none"
                                            @click="resendOTP" :disabled="resendCountdown > 0">
                                            <span v-if="resendCountdown > 0">
                                                Bạn có thể gửi lại sau {{ resendCountdown }}s
                                            </span>
                                            <span v-else>
                                                <i class="bi bi-arrow-repeat me-1"></i>Bạn chưa nhận được email? Gửi lại
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary w-100 py-2"
                                    :disabled="loading || !isOtpComplete">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                        aria-hidden="true"></span>
                                    Xác nhận
                                </button>

                                <button type="button" class="btn btn-outline-secondary w-100 py-2 mt-2"
                                    @click="otpStep = false">
                                    Quay lại
                                </button>
                            </form>
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
import { useUserStore } from '@/stores/user';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const userStore = useUserStore();

// Form states
const dataForm = ref({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
});
const otpDigits = ref(Array(6).fill(''));
const otpStep = ref(false);
const resendCountdown = ref(0);
const otpInputs = ref([]);

const loading = computed(() => userStore.isLoading);
const errorMessage = computed(() => userStore.hasError);
const successMessage = computed(() => userStore.hasSuccess);

// Countdown timer
let countdownInterval = null;

// Computed properties
const isPasswordMatch = computed(() => {
    return !dataForm.value.new_password_confirmation || dataForm.value.new_password === dataForm.value.new_password_confirmation;
});

const isOtpComplete = computed(() => {
    return otpDigits.value.every(digit => digit !== '');
});

// Form submission functions
const submitChangePassword = async () => {
    if (!isPasswordMatch.value) return;

    try {
        await userStore.passwordChangeRequest(dataForm.value);

        // Chuyển sang bước nhập OTP
        otpStep.value = true;
        startResendCountdown();

        // Focus vào ô OTP đầu tiên
        setTimeout(() => {
            if (otpInputs.value[0]) {
                otpInputs.value[0].focus();
            }
        }, 100);

    } catch (error) {

    }
};

const verifyOTP = async () => {
    if (!isOtpComplete.value) return;

    try {
        const data = {
            otp: otpDigits.value.join('')
        }

        await userStore.passwordChangeVerify(data);

        setTimeout(() => {
            // router.push('/account'); // Có thể redirect về trang account
            resetForm();
        }, 3000);

    } catch (error) {

    }
};

const resendOTP = async () => {
    if (resendCountdown.value > 0) return;

    try {
        await userStore.resendPasswordChange();
        startResendCountdown();

        // Xóa thông báo thành công sau 3 giây
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);

    } catch (error) {
        errorMessage.value = 'Không thể gửi lại mã xác nhận. Vui lòng thử lại sau.';
        console.error(error);
    }
};

// OTP input handling
const moveToNext = (event, index) => {
    const digit = event.target.value;

    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(digit)) {
        otpDigits.value[index] = '';
        return;
    }

    // Di chuyển đến ô tiếp theo
    if (digit && index < 5) {
        otpInputs.value[index + 1].focus();
    }
};

const handleDelete = (event, index) => {
    // Di chuyển đến ô trước đó khi xóa
    if (index > 0 && otpDigits.value[index] === '') {
        otpInputs.value[index - 1].focus();
    }
};

const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const numericData = pastedData.replace(/\D/g, '');

    // Điền các ô OTP với dữ liệu dán
    for (let i = 0; i < Math.min(numericData.length, 6); i++) {
        otpDigits.value[i] = numericData[i];
    }

    // Focus vào ô thích hợp
    if (numericData.length < 6) {
        otpInputs.value[Math.min(numericData.length, 5)].focus();
    }
};

// Form reset
const resetForm = () => {
    formData.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    };
    otpDigits.value = Array(6).fill('');
    otpStep.value = false;
    errorMessage.value = '';
    successMessage.value = '';
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
