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
                <NuxtLink to="/report/daily-report/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Tạo báo cáo
                </NuxtLink>
            </div>

            <!-- Bộ lọc -->
            <div class="row g-3 align-items-end mb-4">
                <div class="col-md-3">
                    <label class="form-label">Từ ngày</label>
                    <input type="date" v-model="filters.report_date_from" @change="handleDateChange"
                        class="form-control" />
                </div>
                <div class="col-md-3">
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
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(report, index) in reportStore.dailyReports" :key="index">
                            <td>{{ report.building_name }}</td>
                            <td>{{ report.notes }}</td>
                            <td>{{ report.shift_count }}</td>
                            <td>{{ report.staff_count }}</td>
                            <td>{{ report.report_date }}</td>
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
            <Pagination :pagination="reportStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useReportStore } from '@/stores/report'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const reportStore = useReportStore()

const isLoading = computed(() => reportStore.isLoading)
const hasError = computed(() => reportStore.hasError)

const filters = ref({
    report_date_from: '',
    report_date_to: '',
    page: 1,
    per_page: 10,
})

// Gọi API
const getDailyReportsByStaff = async () => {
    const params = { ...filters.value }
    await reportStore.getReportsByStaff(
        params.report_date_from,
        params.report_date_to,
        params.page,
        params.per_page
    )
    console.log(reportStore.dailyReports)
}

const handleDateChange = () => {
    filters.value.page = 1
    getDailyReportsByStaff()
}

const handlePageChange = (page) => {
    filters.value.page = page
    getDailyReportsByStaff()
}

onMounted(() => {
    getDailyReportsByStaff()
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
