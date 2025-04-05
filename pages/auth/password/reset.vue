<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h1 class="mb-6 text-center text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h1>

            <div v-if="passwordReset" class="mb-4 rounded-md bg-green-50 p-4 text-green-700">
                Đặt lại mật khẩu thành công!
                <nuxt-link to="/login" class="font-medium text-green-800 underline">
                    Đăng nhập ngay
                </nuxt-link>
            </div>

            <form v-else @submit.prevent="submitForm">
                <div class="mb-4">
                    <label for="password" class="mb-2 block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input id="password" v-model="form.password" type="password"
                        class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Nhập mật khẩu mới" required />
                    <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <div class="mb-6">
                    <label for="password_confirmation" class="mb-2 block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu
                    </label>
                    <input id="password_confirmation" v-model="form.password_confirmation" type="password"
                        class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Nhập lại mật khẩu mới" required />
                </div>

                <button type="submit"
                    class="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-75"
                    :disabled="isLoading">
                    <span v-if="isLoading">Đang xử lý...</span>
                    <span v-else>Đặt lại mật khẩu</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

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
        // Gọi API Laravel để đặt lại mật khẩu
        await $fetch('/api/auth/reset-password', {
            method: 'POST',
            body: {
                email: email.value,
                password: form.password,
                password_confirmation: form.password_confirmation,
                token: token.value
            },
        });

        // Hiển thị thông báo thành công
        passwordReset.value = true;
    } catch (error) {
        if (error.response?.status === 422) {
            // Lỗi validation
            errors.value = error.response._data.errors || {};
        } else if (error.response?.status === 400 || error.response?.status === 403) {
            // Token không hợp lệ hoặc hết hạn
            router.push('/auth/password/reset-error');
        } else {
            // Lỗi khác
            errors.value = { password: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' };
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
