import apiService from "@/services/api.service";

export const UserApi = {
    resendEmailVerify() {
        return apiService.post('/email/resend');
    }
};
