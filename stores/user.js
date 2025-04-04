import { defineStore } from "pinia";
import { UserApi } from "~/services/api/user.api";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        loading: false,
        error: null,
    }),

    actions: {
        async resendEmailVerification() {
            this.loading = true;
            try {
                const response = await UserApi.resendEmailVerify();
                if (response) {
                    this.error = null;
                    return response.data;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi gửi lại email!";
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    },
});
