<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else>
        <div class="container py-4">
            <h5 class="fw-bold mb-4">📋 Tạo báo cáo nhân sự theo ca làm việc</h5>

            <!-- Chọn ngày làm việc -->
            <div class="mb-4">
                <label class="form-label">Chọn ngày làm việc:</label>
                <div class="col-md-4">
                    <input type="date" v-model="selectedDate" class="form-control" :max="maxDate" />
                    <small v-if="errors?.['report_date']" class="text-danger">
                        {{ errors?.['report_date'][0] }}
                    </small>
                </div>
            </div>

            <!-- Chọn ca làm việc -->
            <div class="mb-4">
                <label class="form-label">Chọn ca làm việc:</label>
                <div class="row row-cols-1 row-cols-md-3 g-3">
                    <div v-for="shift in availableShifts" :key="shift.shiftId" class="col">
                        <div @click="selectShift(shift)" class="card h-100" :class="{
                            'border-primary': selectedShift && selectedShift.shiftId === shift.shiftId,
                            'text-muted': shift.reported
                        }" :style="{ 'cursor': shift.reported ? 'not-allowed' : 'pointer' }">
                            <div class="card-body">
                                <h5 class="card-title">{{ shift.shiftName }}</h5>
                                <p class="card-text">{{ shift.startTime }} - {{ shift.endTime }}</p>
                                <span v-if="shift.reported" class="badge bg-secondary">Đã báo cáo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chọn nhân viên -->
            <div v-if="selectedShift && !selectedShift.reported" class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label mb-0">Chọn nhân viên:</label>
                    <span class="badge bg-info">
                        Đã chọn: {{ selectedStaff.length }} / {{ filteredStaff.length }}
                    </span>
                </div>

                <div class="mb-3">
                    <input type="text" v-model="searchStaff" placeholder="Tìm kiếm nhân viên..." class="form-control" />
                </div>

                <div class="card">
                    <div class="list-group list-group-flush" style="max-height: 300px; overflow-y: auto;">
                        <div v-for="staff in filteredStaff" :key="staff.id"
                            class="list-group-item list-group-item-action" @click="toggleStaffSelection(staff)"
                            :class="{ 'active': isStaffSelected(staff) }">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-2" :checked="isStaffSelected(staff)"
                                    @click.stop />
                                <div>
                                    <div class="fw-bold">{{ staff.name }}</div>
                                    <div class="small">{{ staff.position }} - {{ staff.department }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tạo báo cáo ca -->
            <div class="mb-4 d-inline-flex gap-2">
                <button v-if="selectedShift && !selectedShift.reported && selectedStaff.length > 0"
                    @click="createShiftReport" class="btn btn-primary">
                    Tạo báo cáo: {{ selectedShift.shiftName }}
                </button>
                <button v-if="selectedShift && !selectedShift.reported && selectedStaff.length > 0"
                    @click="destroyShiftReport" class="btn btn-secondary">
                    Hủy báo cáo: {{ selectedShift.shiftName }}
                </button>
            </div>

            <!-- Danh sách báo cáo ca đã tạo -->
            <div v-if="completedReports.length > 0" class="mb-4">
                <h2 class="h5 mb-3">Báo cáo ca đã tạo:</h2>
                <div class="card">
                    <ul class="list-group list-group-flush">
                        <li v-for="report in completedReports" :key="report.shiftId"
                            class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold">{{ report.shiftName }}</div>
                                <div class="small text-muted">{{ report.staffCount }} nhân viên</div>
                            </div>
                            <button @click="viewReportDetails(report)" class="btn btn-sm btn-outline-secondary">
                                Chi tiết
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Tạo báo cáo ngày -->
            <div class="mt-4 d-inline-flex gap-2">
                <button v-if="allShiftsReported" @click="createDailyReport" class="btn btn-success">
                    Gửi kế hoạch nhân sự: {{ formatDate(selectedDate) }}
                </button>
                <button v-if="allShiftsReported" @click="reset" class="btn btn-secondary">
                    Tạo lại báo cáo ngày: {{ formatDate(selectedDate) }}
                </button>
                <div v-else-if="completedReports.length > 0" class="alert alert-warning">
                    Vui lòng tạo báo cáo cho tất cả các ca làm việc trước khi tạo báo cáo ngày!
                </div>
            </div>

            <!-- Modal xem chi tiết báo cáo -->
            <div class="modal fade" id="reportDetailModal" tabindex="-1" ref="reportModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Chi tiết báo cáo ca {{ selectedReport?.shiftName }}</h5>
                            <button type="button" class="btn-close" @click="closeReportModal"></button>
                        </div>
                        <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                            <div v-if="selectedReport">
                                <div v-for="staff in selectedReport.staffList" :key="staff.id"
                                    class="mb-2 pb-2 border-bottom">
                                    <div class="fw-bold">{{ staff.name }}</div>
                                    <div class="small text-muted">{{ staff.position }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeReportModal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal xác nhận tạo báo cáo ngày -->
            <div class="modal fade" id="dailyReportModal" tabindex="-1" ref="dailyReportModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Xác nhận tạo báo cáo ngày {{ formatDate(selectedDate) }}</h5>
                            <button type="button" class="btn-close" @click="closeDailyReportModal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Báo cáo sẽ bao gồm tất cả {{ completedReports.length }} ca làm việc với tổng cộng {{
                                totalStaffCount }} nhân viên.</p>
                            <div class="mt-3 small text-muted">
                                <div v-for="report in completedReports" :key="report.shiftId" class="mb-1">
                                    - {{ report.shiftName }}: {{ report.staffCount }} nhân viên
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeDailyReportModal">Hủy</button>
                            <button type="button" class="btn btn-success" @click="confirmDailyReport">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useReportStore } from '@/stores/report';
import { useToast } from 'vue-toastification';
import { useDashboardStore } from '@/stores/dashboard';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
});

const reportStore = useReportStore();
const dashboardStore = useDashboardStore();
const toast = useToast();
const isLoading = computed(() => reportStore.isLoading);
const errors = ref({});

const selectedDate = ref('');
const selectedShift = ref(null);
const selectedStaff = ref([]);
const searchStaff = ref('');
const completedReports = ref([]);
const availableShifts = ref([]);
const staffList = ref([]);
const selectedReport = ref(null);
const reportModal = ref(null);
const dailyReportModal = ref(null);

const report = ref({
    building_id: '',
    report_date: '',
    notes: '',
    shifts: []
});

const loadFormInfo = async () => {
    const response = await reportStore.getFormInfo(dashboardStore.getSelectedBuildingId);
    if (response) {
        availableShifts.value = response.shifts;
        availableShifts.value.forEach(shift => {
            shift.reported = false;
        });
        staffList.value = response.personnel;
        selectedDate.value = response.date;
    }
};

const maxDate = new Date().toISOString().split('T')[0];

const filteredStaff = computed(() => {
    if (!searchStaff.value) return staffList.value;
    const searchTerm = searchStaff.value.toLowerCase();
    return staffList.value.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.position.toLowerCase().includes(searchTerm)
    );
});

const allShiftsReported = computed(() => {
    return availableShifts.value.every(shift => shift.reported);
});

const totalStaffCount = computed(() => {
    return completedReports.value.reduce((total, report) => total + report.staffCount, 0);
});

function selectShift(shift) {
    if (shift.reported) return;
    selectedShift.value = shift;
    selectedStaff.value = [];
}

function toggleStaffSelection(staff) {
    const index = selectedStaff.value.findIndex(s => s.id === staff.id);
    if (index === -1) {
        selectedStaff.value.push(staff);
    } else {
        selectedStaff.value.splice(index, 1);
    }
}

function isStaffSelected(staff) {
    return selectedStaff.value.some(s => s.id === staff.id);
}

function createShiftReport() {
    if (!selectedShift.value || selectedStaff.value.length === 0) return;
    const shiftIndex = availableShifts.value.findIndex(s => s.shiftId === selectedShift.value.shiftId);
    availableShifts.value[shiftIndex].reported = true;

    completedReports.value.push({
        shiftId: selectedShift.value.shiftId,
        shiftName: selectedShift.value.shiftName,
        staffCount: selectedStaff.value.length,
        staffList: [...selectedStaff.value],
    });

    selectedShift.value = null;
    selectedStaff.value = [];
}

const destroyShiftReport = () => {
    reset();
};

function viewReportDetails(report) {
    selectedReport.value = report;
    const modal = new bootstrap.Modal(document.getElementById('reportDetailModal'));
    modal.show();
}

function closeReportModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('reportDetailModal'));
    if (modal) modal.hide();
}

function createDailyReport() {
    if (!allShiftsReported.value) return;
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

const reset = () => {
    availableShifts.value = availableShifts.value.map(shift => ({ ...shift, reported: false }));
    completedReports.value = [];
    selectedShift.value = null;
    selectedStaff.value = [];
    report.value.shifts = [];
};

const confirmDailyReport = async () => {
    report.value.building_id = dashboardStore.getSelectedBuildingId;
    report.value.report_date = selectedDate.value;
    report.value.notes = `Báo cáo ngày ${formatDate(selectedDate.value)}`;
    report.value.shifts = completedReports.value;

    try {
        const result = await reportStore.createDailyReports(report.value);
        closeDailyReportModal();
        if (result.data) {
            toast.success('Gửi kế hoạch nhân sự thành công!');
            errors.value = null;
            reset();
        }
    } catch (error) {
        errors.value = error.errors;
        closeDailyReportModal();
    }
};

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

onMounted(() => {
    loadFormInfo();
});
</script>
