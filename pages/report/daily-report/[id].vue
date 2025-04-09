<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else class="container py-4">
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h4 class="fw-bold mb-3">Chi tiết báo cáo ngày: {{ report?.report_date }}</h4>
                <div class="row mb-2">
                    <div class="col-md-4"><strong>Tòa nhà:</strong> {{ report?.building }}</div>
                    <div class="col-md-4"><strong>Người tạo:</strong> {{ report?.created_by }}</div>
                    <div class="col-md-4"><strong>Trạng thái: </strong>
                        <span :class="{
                            'badge bg-info': report?.status === 'draft',
                            'badge bg-warning': report?.status === 'submitted',
                            'badge bg-danger': report?.status === 'cancelled',
                        }">
                            {{ getStatusText(report?.status) }}
                        </span>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-4">
                        <strong>Ghi chú: </strong> {{ report?.notes || 'Không có' }}
                    </div>
                    <div class="col-md-4">
                        <strong>Số ca trực: </strong> {{ report?.total_shifts || 'Không có' }}
                    </div>
                    <div class="col-md-4">
                        <strong>Số người trực: </strong> {{ report?.total_staffs || 'Không có' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="accordion" id="shiftsAccordion">
            <div class="accordion-item" v-for="(shift, index) in report?.shifts" :key="index">
                <h2 class="accordion-header" :id="`heading-${index}`">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-${index}`" aria-expanded="false"
                        :aria-controls="`collapse-${index}`">
                        {{ index + 1 }}: {{ shift.shift_name }} ({{ shift.start_time }} - {{ shift.end_time }}) - Tổng
                        nhân sự: {{
                            shift.staffs.length }}
                    </button>
                </h2>
                <div :id="`collapse-${index}`" class="accordion-collapse collapse" :aria-labelledby="`heading-${index}`"
                    data-bs-parent="#shiftsAccordion">
                    <div class="accordion-body p-0">
                        <table class="table table-bordered m-0">
                            <thead class="table-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>Vị trí</th>
                                    <th>Số điện thoại</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="shift.staffs.length === 0">
                                    <td colspan="5" class="text-center text-muted">Không có nhân sự</td>
                                </tr>
                                <tr v-for="(staff, i) in shift.staffs" :key="staff.id">
                                    <td>{{ i + 1 }}</td>
                                    <td>{{ staff.personnel_name }}</td>
                                    <td>{{ getPositionText(staff.position) }}</td>
                                    <td>{{ staff.phone }}</td>
                                    <td>{{ staff.performance_note }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 d-flex justify-content-end">
            <button class="btn btn-secondary me-2" @click="back()">Quay lại</button>
            <button class="btn btn-primary">Xuất PDF</button>
        </div>
    </div>
</template>

<script setup>
import { useReportStore } from '@/stores/report'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const reportStore = useReportStore()
const route = useRoute()
const router = useRouter()
const report_id = route.params.id
const isLoading = computed(() => reportStore.isLoading);


// Giả lập dữ liệu mẫu (bạn nên thay bằng API call)
const report = ref(null)

const getStatusText = (status) => {
    if (status === 'draft') return 'Kế hoạch'
    if (status === 'submitted') return 'Đã cập nhật'
    if (status === 'cancelled') return 'Đã hủy'
    return status
}

const getPositionText = (position) => {
    if (position === 'receptionist') return 'Lễ tân'
    if (position === 'accountant') return 'Kế toán'
    if (position === 'technical') return 'Kỹ thuật'
    if (position === 'security') return 'Bảo vệ'
    return position
}

const back = () => {
    router.back()
}

const fetchReportDetail = async () => {
    try {
        const result = await reportStore.getReportDetail(report_id)
        if (result) {
            report.value = result
        }
    } catch (error) {

    }
}

onMounted(fetchReportDetail)
</script>
