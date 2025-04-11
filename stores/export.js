import { defineStore } from "pinia";
import { ExportApi } from "~/services/api/export.api";

export const useExportStore = defineStore("export", {
    state: () => ({
        url: null
    }),

    actions: {
        async exportInvoice(id) {
            try {
                const response = await ExportApi.exportInvoice(id);

                // Tạo file name (có thể lấy từ header nếu cần)
                const fileName = `HoaDon_${id}.xlsx`;

                // Tạo link download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Export invoice failed:", error);
                throw error;
            }
        },

    },
});
