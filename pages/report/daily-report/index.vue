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
                    <label class="form-label fw-bold">Trạng thái</label>
                    <select v-model="filters.status" @change="onFilter" class="form-select">
                        <option value="" selected>Chọn trạng thái</option>
                        <option value="draft">Kế hoạch</option>
                        <option value="submitted">Đã cập nhật</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Từ ngày</label>
                    <input type="date" v-model="filters.report_date_from" @change="handleDateChange"
                        class="form-control" />
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Đến ngày</label>
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
                                            ? 'Kế hoạch'
                                            : report.status === 'submitted'
                                                ? 'Đã cập nhật'
                                                : 'Đã hủy'
                                    }}
                                </span>
                            </td>
                            <td class="align-middle text-center">
                                <div class="d-inline-flex gap-2">
                                    <NuxtLink :to="`/report/daily-report/${report.daily_report_id}`"
                                        class="btn btn-sm btn-success align-items-center justify-content-center gap-1">
                                        <Icon name="bxs:detail" size="18" /> Xem
                                    </NuxtLink>
                                    <NuxtLink
                                        :to="report.status === 'draft' ? `/report/daily-report/edit/${report.daily_report_id}` : '#'"
                                        :class="['btn', 'btn-sm', 'btn-warning', 'align-items-center', 'justify-content-center', 'gap-1', { 'disabled opacity-50': report.status !== 'draft' }]"
                                        :title="report.status !== 'draft' ? 'Báo cáo không thể chỉnh sửa vì trạng thái không phải draft' : 'Chỉnh sửa báo cáo'"
                                        @click.prevent="report.status !== 'draft' ? null : undefined">
                                        <Icon name="bxs:edit-alt" size="20" class="me-1" /> Sửa
                                    </NuxtLink>
                                </div>
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
import { ref, computed, onMounted } from 'vue'
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
    status: '',
    page: 1,
    per_page: 10,
})

const getDailyReportsByStaff = async () => {
    const params = { ...filters.value }
    await reportStore.getReportsByStaff(
        params.report_date_from,
        params.report_date_to,
        params.status,
        params.page,
        params.per_page
    )
}

const onFilter = () => {
    filters.value.page = 1
    getDailyReportsByStaff()
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
