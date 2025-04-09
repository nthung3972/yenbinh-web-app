<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else>
        <div class="container py-4">
            <h5 class="fw-bold mb-4">📋 Cập nhật báo cáo nhân sự cuối ngày</h5>

            <!-- Chọn ngày làm việc -->
            <div class="mb-4">
                <label class="form-label">Ngày làm việc:</label>
                <div class="col-md-4">
                    <input type="date" v-model="selectedDate" class="form-control" :max="maxDate" disabled />
                </div>
            </div>

            <!-- Danh sách ca và nhân viên -->
            <div v-for="(report, index) in completedReports" :key="report.shiftId" class="mb-4">
                <h6 class="fw-bold">{{ report.shiftName }} ({{ report.staffCount }} nhân viên)</h6>
                <div class="card">
                    <div class="list-group list-group-flush">
                        <div v-for="(staff, index) in report.staffList" :key="index"  class="list-group-item">
                            <!-- <div v-for="(vehicle, index) in vehicles" :key="index" class="mb-4 border p-3 rounded"></div> -->
                            <div class="row align-items-center">
                                <div class="col-md-3">
                                    <div class="fw-bold">{{ staff.name }}</div>
                                    <div class="small text-muted">{{ staff.position }}</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">Giờ bắt đầu</label>
                                    <input type="time" v-model="staff.workTimeStart" class="form-control" />
                                    <small v-if="errors[`shifts.${index}.staffList.${index}.workTimeStart`]" class="text-danger">
                                        {{ errors[`shifts.${index}.staffList.${index}.workTimeStart`][0] }}
                                    </small>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">Giờ kết thúc</label>
                                    <input type="time" v-model="staff.workTimeEnd" class="form-control" />
                                    <small v-if="errors[`shifts.${index}.staffList.${index}.workTimeEnd`]" class="text-danger">
                                        {{ errors[`shifts.${index}.staffList.${index}.workTimeEnd`][0] }}
                                    </small>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-check">
                                        <input type="checkbox" v-model="staff.isLate" class="form-check-input" />
                                        <label class="form-check-label">Đi muộn</label>
                                    </div>
                                    <div class="form-check">
                                        <input type="checkbox" v-model="staff.isOvertime" class="form-check-input" />
                                        <label class="form-check-label">Tăng ca</label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Hiệu suất</label>
                                    <input type="text" v-model="staff.performanceNote" class="form-control"
                                        placeholder="Ghi chú hiệu suất" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cập nhật báo cáo ngày -->
            <div class="mt-4 d-inline-flex gap-2">
                <button @click="updateDailyReport" class="btn btn-success">
                    Cập nhật báo cáo ngày: {{ formatDate(selectedDate) }}
                </button>
                <nuxt-link to="/report/daily-report" class="btn btn-secondary">Hủy</nuxt-link>
            </div>

            <!-- Modal xác nhận cập nhật -->
            <div class="modal fade" id="dailyReportModal" tabindex="-1" ref="dailyReportModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Xác nhận cập nhật báo cáo ngày {{ formatDate(selectedDate) }}</h5>
                            <button type="button" class="btn-close" @click="closeDailyReportModal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Báo cáo sẽ bao gồm {{ completedReports.length }} ca với tổng cộng {{ totalStaffCount }}
                                nhân viên.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeDailyReportModal">Hủy</button>
                            <button type="button" class="btn btn-success" @click="confirmUpdateDailyReport">Xác
                                nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReportStore } from '@/stores/report';
import { useToast } from 'vue-toastification';
import { useDashboardStore } from '@/stores/dashboard';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
});

const route = useRoute();
const reportStore = useReportStore();
const dashboardStore = useDashboardStore();
const toast = useToast();
const isLoading = computed(() => reportStore.isLoading);
const errors = ref({});

const selectedDate = ref('');
const completedReports = ref([]);
const dailyReportModal = ref(null);

const report = ref({
    building_id: '',
    report_date: '',
    notes: '',
    shifts: []
});

const loadReportData = async () => {
    try {
        const response = await reportStore.getReportDetail(route.params.id);
        const reportData = response;

        selectedDate.value = reportData.report_date;
        report.value.building_id = reportData.building_id || dashboardStore.getSelectedBuildingId;
        report.value.notes = reportData.notes;

        completedReports.value = reportData.shifts.map(shift => ({
            shiftId: shift.shift_id,
            shiftName: shift.shift_name,
            staffCount: shift.staffs.length,
            staffList: shift.staffs.map(staff => ({
                id: staff.building_personnel_id,
                name: staff.personnel_name,
                position: staff.position,
                workTimeStart: staff.workTimeStart || '',
                workTimeEnd: staff.workTimeEnd || '',
                isLate: staff.is_late || false,
                isOvertime: staff.is_overtime || false,
                performanceNote: staff.performance_note || '',
            })),
        }));
    } catch (error) {
        toast.error('Không thể tải dữ liệu báo cáo.');
        console.error(error);
    }
};

const maxDate = new Date().toISOString().split('T')[0];

const totalStaffCount = computed(() => {
    return completedReports.value.reduce((total, report) => total + report.staffCount, 0);
});

function updateDailyReport() {
    if (completedReports.value.length === 0) return;
    const modal = new bootstrap.Modal(document.getElementById('dailyReportModal'));
    modal.show();
}

function closeDailyReportModal() {
    const modalElement = document.getElementById('dailyReportModal');
    if (!modalElement) return;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();

    setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.parentNode.removeChild(backdrop));
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }, 150);
}

const confirmUpdateDailyReport = async () => {
    report.value.building_id = dashboardStore.getSelectedBuildingId;
    report.value.report_date = selectedDate.value;
    report.value.notes = `Báo cáo ngày ${formatDate(selectedDate.value)}`;
    report.value.shifts = completedReports.value.map(report => ({
        shiftId: report.shiftId,
        staffList: report.staffList.map(staff => ({
            id: staff.id,
            workTimeStart: staff.workTimeStart,
            workTimeEnd: staff.workTimeEnd,
            isLate: staff.isLate,
            isOvertime: staff.isOvertime,
            performanceNote: staff.performanceNote,
        })),
    }));

    try {
        const result = await reportStore.updateDailyReport(route.params.id, report.value);
        closeDailyReportModal();
        if (result.data) {
            toast.success('Cập nhật báo cáo thành công!');
            errors.value = null;
            navigateTo('/report/daily-report');
        }
    } catch (error) {
        errors.value = error.errors || {}
        console.log(errors.value)
        closeDailyReportModal();
        toast.error('Có lỗi xảy ra khi cập nhật báo cáo.');
    }
};

// Hàm lấy lỗi cho từng trường
// function getError(shiftIndex, staffIndex, field) {
//     const errorKey = `shifts.${shiftIndex}.staffList.${staffIndex}.${field}`;
//     return errors.value[errorKey] ? errors.value[errorKey][0] : null;
// }

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

onMounted(() => {
    loadReportData();
});
</script>
