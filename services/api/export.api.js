import apiService from "@/services/api.service";

export const ExportApi = {
    exportInvoice(id) {
        return apiService.get(`/export/invoices/${id}`, {
            responseType: 'blob',
            headers: {
              Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // ✅ đúng định dạng
            },
        }).then(res => {
            console.log("✅ API response:", res);
            return res;
          }).catch(err => {
            console.error("❌ API export error:", err);
            throw err;
          });
    }
};
