import apiService from "@/services/api.service";

export const UserApi = {
    resendEmailVerify() {
        return apiService.post('/email/resend');
    },

    passwordChangeRequest(data) {
        return apiService.post('/me/password-change-request', data);
    },

    passwordChangeVerify(data) {
        return apiService.post('/me/password-change-verify', data);
    },

    resendPasswordChange() {
        return apiService.post('/me/resend-password-change');
    },

    forgotPassword(data) {
        return apiService.post('/auth/forgot-password', data);
    },

    resendForgotPassword(data) {
        return apiService.post('/auth/forgot-password/resend', data);
    },

    resetPassword(data) {
        return apiService.post('/auth/reset-password', data);
    }
};
