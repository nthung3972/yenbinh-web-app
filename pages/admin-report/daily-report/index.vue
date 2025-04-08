<template>
    <div class="card shadow-sm p-4 m-4">
        <!-- Loading / Error -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p class="text-muted">Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError" class="alert alert-danger text-center">
            {{ hasError }}
        </div>

        <!-- Nội dung chính -->
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">📋 Danh sách báo cáo nhân sự ngày</h5>
            </div>

            <!-- Bộ lọc -->
            <div class="row g-3 align-items-end mb-4">
                <div class="col-md-3">
                    <label class="form-label">Tòa nhà</label>
                    <select v-model="filters.building_id" @change="onFilter" class="form-select">
                        <option value="" selected>Chọn tòa nhà</option>
                        <option v-for="building in dashboardStore.getData" :key="building.building_id"
                            :value="building.building_id">
                            {{ building.name }}
                        </option>
                    </select>
                </div>

                <div class="col-md-2">
                    <label class="form-label">Trạng thái</label>
                    <select v-model="filters.status" @change="onFilter" class="form-select">
                        <option value="" selected>Chọn trạng thái</option>
                        <option value="draft">Chưa duyệt</option>
                        <option value="submitted">Đã duyệt</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>

                <div class="col-md-2">
                    <label class="form-label">Từ ngày</label>
                    <input type="date" v-model="filters.report_date_from" @change="handleDateChange"
                        class="form-control" />
                </div>

                <div class="col-md-2">
                    <label class="form-label">Đến ngày</label>
                    <input type="date" v-model="filters.report_date_to" @change="handleDateChange"
                        class="form-control" />
                </div>
            </div>

            <!-- Bảng dữ liệu -->
            <div class="table-responsive">
                <table class="table table-hover align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>Tòa nhà</th>
                            <th>Nội dung</th>
                            <th>Ca trực</th>
                            <th>Nhân viên</th>
                            <th>Ngày tạo</th>
                            <th>Người tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(report, index) in adminReportStore.dailyReports" :key="index">
                            <td>{{ report.building }}</td>
                            <td>{{ report.notes }}</td>
                            <td>{{ report.total_shifts }}</td>
                            <td>{{ report.total_staff }}</td>
                            <td>{{ report.report_date }}</td>
                            <td>{{ report.created_by }}</td>
                            <td>
                                <span :class="{
                                    'badge bg-info': report.status === 'draft',
                                    'badge bg-warning text-dark': report.status === 'submitted',
                                    'badge bg-danger': report.status === 'cancelled'
                                }">
                                    {{
                                        report.status === 'draft'
                                            ? 'Chưa duyệt'
                                            : report.status === 'submitted'
                                                ? 'Đã duyệt'
                                    : 'Đã hủy'
                                    }}
                                </span>
                            </td>
                            <td class="d-flex">
                                <NuxtLink :to="`/admin-report/daily-report/${report.report_id}`"
                                    class="btn btn-sm btn-success align-items-center justify-content-center gap-1">
                                    <Icon name="bxs:detail" size="18" /> Chi tiết
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Phân trang -->
            <Pagination :pagination="adminReportStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAdminReportStore } from '@/stores/admin-report'
import { useDashboardStore } from '@/stores/dashboard'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const adminReportStore = useAdminReportStore()
const dashboardStore = useDashboardStore()

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
