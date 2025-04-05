<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h1 class="mb-6 text-center text-2xl font-bold text-gray-800">Quên mật khẩu</h1>

            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" v-model="email" type="email"
                        class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Nhập email của bạn" required />
                    <!-- <p v-if="errors?.email" class="mt-1 text-sm text-red-600">{{ errors?.email }}</p> -->
                </div>

                <button type="submit"
                    class="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-75"
                    :disabled="isLoading">
                    <span v-if="isLoading">Đang xử lý...</span>
                    <span v-else>Gửi link khôi phục</span>
                </button>

                <div v-if="errorMessage" class="alert alert-danger mt-3">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success mt-3">
                    {{ successMessage }}
                </div>

                <div class="mt-4 text-center">
                    <nuxt-link to="/auth/login" class="text-sm text-blue-600 hover:underline">
                        Quay lại đăng nhập
                    </nuxt-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const email = ref('');
const userStore = useUserStore();
const isLoading = computed(() => userStore.isLoading);
const errorMessage = computed(() => userStore.hasError);
const successMessage = computed(() => userStore.hasSuccess);

const submitForm = async () => {
    try {
        const data = {
            email: email.value,
        };

        await userStore.forgotPasswordRequest(data);
    } catch (error) {

    }
};
</script>