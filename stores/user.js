import { defineStore } from "pinia";
import { UserApi } from "~/services/api/user.api";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        success: null,
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
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async passwordChangeRequest(data) {
            this.loading = true;
            try {
                const response = await UserApi.passwordChangeRequest(data);
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async passwordChangeVerify(data) {
            this.loading = true;
            try {
                const response = await UserApi.passwordChangeVerify(data);
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                this.success = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resendPasswordChange() {
            this.loading = true;
            try {
                const response = await UserApi.resendPasswordChange();
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                this.success = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async forgotPasswordRequest(data) {
            this.loading = true;
            try {
                const response = await UserApi.forgotPassword(data);
                
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                console.log('error' , error);
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                this.success = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resendForgotPassword(data) {
            this.loading = true;
            try {
                const response = await UserApi.resendForgotPassword(data);
                
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                console.log('error' , error);
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                this.success = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(data) {
            this.loading = true;
            try {
                const response = await UserApi.resetPassword(data);
                
                if (response.status === 200) {
                    this.success = response.data.message;
                    this.error = null;
                }
            } catch (error) {
                console.log('error' , error);
                if (error.message) {
                    this.error = error.message;
                }
                else if (error.error) {
                    this.error = error.error;
                }
                this.success = null;
                throw error;
            } finally {
                this.loading = false;
            }
        }

    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
        hasSuccess: (state) => state.success
    },
});
