import { defineStore } from "pinia";
import { toHandlerKey } from "vue";
import { UserApi } from "~/services/api/user.api";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        avatar: null,
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
        },

        async getUserInfo() {
            this.loading = true
            try {
                const response = await UserApi.userInfo()
                if(response.data) {
                    this.error = null
                    this.avatar = response.data.data.user.avatar
                    return response.data.data
                }
            } catch (error) {
                console.log('Đã xảy ra lỗi khi lây thông tin người dùng!')
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateUerInfo(data) {
            this.loading = true
            try {
                const respone = await UserApi.updateUserInfo(data)
                if(respone) {
                    this.error = null
                    return respone.data
                }
            } catch (error) {
                console.log(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        setAvatar(avatar) {
            console.log('new:', avatar)
            this.avatar = avatar;
        },


    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
        hasSuccess: (state) => state.success
    },
});
