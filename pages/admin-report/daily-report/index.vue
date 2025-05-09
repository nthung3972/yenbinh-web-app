<template>
    <div class="card shadow-lg p-4 border-0">
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="material-symbols:report" size="24" />Danh sách báo cáo nhân sự ngày
                </h5>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label fw-bold">Tòa nhà</label>
                            <select v-model="filters.building_id" @change="onFilter" class="form-select">
                                <option value="" selected>Chọn tòa nhà</option>
                                <option v-for="building in dashboardStore.getData" :key="building.building_id"
                                    :value="building.building_id">
                                    {{ building.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label fw-bold">Trạng thái</label>
                            <select v-model="filters.status" @change="onFilter" class="form-select">
                                <option value="" selected>Chọn trạng thái</option>
                                <option value="draft">Kế hoạch</option>
                                <option value="submitted">Đã cập nhật</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        <div class="col-md-2">
                            <label class="form-label fw-bold">Từ ngày</label>
                            <input type="date" v-model="filters.report_date_from" @change="handleDateChange"
                                class="form-control" />
                        </div>

                        <div class="col-md-2">
                            <label class="form-label fw-bold">Đến ngày</label>
                            <input type="date" v-model="filters.report_date_to" @change="handleDateChange"
                                class="form-control" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                    <thead class="table-light sticky-top" style="z-index: 1;">
                        <tr>
                            <th style="width: 15%;">Tòa nhà</th>
                            <th style="width: 25%;">Nội dung</th>
                            <th style="width: 10%;">Ca trực</th>
                            <th style="width: 10%;">Nhân viên</th>
                            <th style="width: 15%;">Ngày tạo</th>
                            <th style="width: 15%;">Người tạo</th>
                            <th style="width: 10%;">Trạng thái</th>
                            <th style="width: 20%; text-align: center;">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(report, index) in adminReportStore.dailyReports" :key="index">
                            <td>{{ report.building }}</td>
                            <td>{{ report.notes }}</td>
                            <td>{{ report.total_shifts }}</td>
                            <td>{{ report.total_staff }}</td>
                            <td>{{ report.report_date }}</td>
                            <td>{{ report.created_by ?? 'Chưa có' }}</td>
                            <td>
                                <span :class="[
                                    'badge',
                                    report.status === 'draft' ? 'bg-info' :
                                        report.status === 'submitted' ? 'bg-success' :
                                            'bg-danger'
                                ]">
                                    {{
                                        report.status === 'draft' ? 'Kế hoạch' :
                                            report.status === 'submitted' ? 'Đã cập nhật' :
                                                'Đã hủy'
                                    }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="btn-group gap-2">
                                    <NuxtLink :to="`/admin-report/daily-report/${report.report_id}`"
                                        class="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2">
                                        <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                                    </NuxtLink>
                                    <button type="button"
                                        class="btn btn-sm btn-outline-danger d-flex align-items-center px-3 py-2"
                                        data-bs-toggle="modal" data-bs-target="#deleteDailyReportModal"
                                        @click="setSelectedDailyreport(report.report_id)">
                                        <Icon name="material-symbols:delete" size="16" class="me-1" /> Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Phân trang -->
            <Pagination :pagination="adminReportStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>

    <!-- Modal Xóa Báo Cáo -->
    <div class="modal fade" id="deleteDailyReportModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="deleteDailyReport" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title">Xác Nhận Xóa Nhân Viên</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Bạn có chắc chắn muốn xóa nhân viên này không?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-danger">Xóa</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAdminReportStore } from '@/stores/admin-report'
import { useDashboardStore } from '@/stores/dashboard'
import Pagination from '@/components/pagination/Pagination.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const adminReportStore = useAdminReportStore()
const dashboardStore = useDashboardStore()
const toast = useToast()
const report_id = ref('')

const isLoading = computed(() => adminReportStore.isLoading)
const hasError = computed(() => adminReportStore.hasError)

const filters = ref({
    building_id: '',
    status: '',
    report_date_from: '',
    report_date_to: '',
    page: 1,
    per_page: 10,
})

const setSelectedDailyreport = (id) => {
    report_id.value = parseInt(id);
};

// Gọi API
const getDailyReports = async () => {
    const params = { ...filters.value }
    await adminReportStore.getDailyReports(
        params.building_id,
        params.status,
        params.report_date_from,
        params.report_date_to,
        params.page,
        params.per_page
    )
    console.log(adminReportStore.dailyReports)
}

const deleteDailyReport = async () => {
    try {
        await adminReportStore.deleteDailyReport(report_id.value)
        document.getElementById('deleteDailyReportModal').querySelector('[data-bs-dismiss="modal"]').click()
        toast.success('Xóa báo cáo thành công!')
    } catch (error) {
        document.getElementById('deleteDailyReportModal').querySelector('[data-bs-dismiss="modal"]').click()
        toast.error('Đã xảy ra lỗi khi xóa báo cáo!')
    }
}

const onFilter = () => {
    filters.value.page = 1
    getDailyReports()
}

const handleDateChange = () => {
    filters.value.page = 1
    getDailyReports()
}

const handlePageChange = (page) => {
    filters.value.page = page
    getDailyReports()
}

onMounted(() => {
    getDailyReports()
})
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
