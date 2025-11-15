<template>
    <div class="container-fluid py-2">
        <!-- Header -->
        <div class="row mb-3">
            <div class="col">
                <h3 class="mb-0">
                    📊 NHẬP CHỈ SỐ ĐIỆN NƯỚC
                </h3>
            </div>
        </div>

        <!-- Filters -->
        <div class="row mb-4">
            <div class="col-md-12">
                <label class="form-label">Kỳ ghi chỉ số:</label>
                <input v-model="filters.period" type="month" class="form-control" @change="fetchReadings" />
                <div v-if="errors.period" class="text-danger small mt-1">{{ errors.period }}</div>
            </div>
        </div>

        <!-- Import Section -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-upload"></i> Tải dữ liệu lên
                </h5>

                <!-- Drag & Drop Area -->
                <div class="upload-area text-center py-5 mb-3" :class="{ 'dragging': isDragging }"
                    @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleFileDrop" @click="$refs.fileInput.click()">
                    <i class="bi bi-cloud-upload fs-1 text-primary"></i>
                    <p class="mt-3 mb-2">
                        <strong>📁 Kéo thả file Excel hoặc click để chọn</strong>
                    </p>
                    <p class="text-muted small">Chấp nhận file .xlsx, .xls (tối đa 5MB)</p>

                    <button class="btn btn-outline-primary btn-sm mt-2" @click.stop="downloadTemplate">
                        <i class="bi bi-download"></i> 💡 Tải Template mẫu
                    </button>

                    <input ref="fileInput" type="file" class="d-none" accept=".xlsx,.xls" @change="handleFileSelect" />
                </div>

                <!-- Selected File Info -->
                <div v-if="selectedFile" class="alert alert-info d-flex align-items-center">
                    <i class="bi bi-file-earmark-excel fs-4 me-3"></i>
                    <div class="flex-grow-1">
                        <strong>{{ selectedFile.name }}</strong>
                        <small class="d-block text-muted">{{ formatFileSize(selectedFile.size) }}</small>
                    </div>
                    <button class="btn btn-sm btn-danger" @click="deleteFileSelect">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" :disabled="!selectedFile || isUploading" @click="uploadFile">
                        <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-upload"></i>
                        {{ isUploading ? 'Đang nhập Excel...' : 'Nhập dữ liệu vào hệ thống' }}
                    </button>

                    <button class="btn btn-outline-info" disabled>
                        <i class="bi bi-arrow-repeat"></i> 🔄 Đồng bộ từ IoT
                    </button>
                </div>

                <!-- Upload Progress -->
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                            :style="{ width: uploadProgress + '%' }">
                            {{ uploadProgress }}%
                        </div>
                    </div>
                </div>

                <!-- Upload Result -->
                <div v-if="uploadResult" class="mt-3">
                    <div :class="`alert alert-${uploadResult.success ? 'success' : 'danger'}`">
                        <strong>{{ uploadResult.message }}</strong>
                        <div v-if="uploadResult.data" class="mt-2 small">
                            <div>✅ Thành công: {{ uploadResult.data.success }} dòng</div>
                            <div v-if="uploadResult.data.errors?.length">
                                ❌ Lỗi: {{ uploadResult.data.errors.length }} dòng
                                <button class="btn btn-sm btn-link" @click="showErrors = !showErrors">
                                    {{ showErrors ? 'Ẩn' : 'Xem chi tiết' }}
                                </button>
                            </div>
                            <ul v-if="showErrors" class="mt-2 mb-0">
                                <li v-for="(error, idx) in uploadResult.data.errors" :key="idx">
                                    Dòng {{ error.row }}: {{ error.message }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics -->
        <div class="row mb-3">
            <div class="col">
                <div class="alert alert-light d-flex justify-content-between align-items-center mb-0">
                    <div>
                        📊 <strong>Dự kiến:</strong> {{ statistics.total }} |
                        ✅ <strong>Đã nhập:</strong> {{ statistics.completed }} |
                        ⚠️ <strong>Còn thiếu:</strong> {{ statistics.missing }}
                    </div>
                    <button v-if="hasConfirmedReadings" class="btn btn-success" @click="openConfirmModal"
                        :disabled="isCalculating">
                        <span v-if="isCalculating" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-check-circle"></i>
                        {{ isCalculating ? 'Đang xử lý...' : 'Xác nhận & Cộng vào hóa đơn' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    DANH SÁCH CHỈ SỐ THÁNG {{ formatPeriod(filters.period) }}
                </h5>

                <table class="table table-sm table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 15%">Căn hộ</th>
                            <th style="width: 10%">Loại</th>
                            <th style="width: 10%">Chỉ số đầu</th>
                            <th style="width: 10%">Chỉ số cuối</th>
                            <th style="width: 10%">Tiêu thụ</th>
                            <th style="width: 10%">Đơn giá</th>
                            <th style="width: 10%">Thành tiền</th>
                            <th style="width: 20%">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="10" class="text-center py-4">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
                            </td>
                        </tr>

                        <tr v-else-if="readings.length === 0">
                            <td colspan="10" class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-1"></i>
                                <p class="mt-2">Chưa có dữ liệu</p>
                            </td>
                        </tr>

                        <tr v-for="reading in readings" :key="reading.id">
                            <td>
                                <strong>{{ reading.apartment_number }}</strong>
                            </td>
                            <td>
                                <span :class="`badge bg-${reading.utility_type === 'electric' ? 'warning' : 'info'}`">
                                    {{ reading.utility_type === 'electric' ? '⚡ Điện' : '💧 Nước' }}
                                </span>
                            </td>
                            <td>{{ formatNumber(reading.previous_reading) }}</td>
                            <td>{{ formatNumber(reading.current_reading) }}</td>
                            <td>
                                <strong>{{ formatNumber(reading.consumption) }}</strong>
                                <small class="text-muted">
                                    {{ reading.utility_type === 'electric' ? 'số' : 'm³' }}
                                </small>
                            </td>
                            <td>{{ formatCurrency(reading.unit_price) }}</td>
                            <td>
                                <strong class="text-primary">{{ formatCurrency(reading.amount) }}</strong>
                            </td>
                            <td>
                                <span :class="`badge bg-${getStatusColor(reading.status)}`">
                                    {{ getStatusText(reading.status) }}
                                </span>
                            </td>
                            <!-- <td class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        
                                        <button v-if="reading.photo_url" class="btn btn-outline-info"
                                            @click="viewPhoto(reading.photo_url)" title="Xem ảnh">
                                            <i class="bi bi-image"></i>
                                        </button>
                                    </div>
                                </td> -->
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <nav v-if="pagination.total > 0" class="mt-3">
                    <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                            <a class="page-link" @click="goToPage(pagination.currentPage - 1)">Trước</a>
                        </li>
                        <li v-for="page in visiblePages" :key="page" class="page-item"
                            :class="{ active: page === pagination.currentPage }">
                            <a class="page-link" @click="goToPage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.lastPage }">
                            <a class="page-link" @click="goToPage(pagination.currentPage + 1)">Sau</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>

    <!-- Modal xác nhận -->
    <div class="modal fade show d-block" v-if="showConfirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Xác nhận chỉ số điện nước</h5>
                    <button type="button" class="btn-close" @click="showConfirmModal = false"></button>
                </div>
                <div class="modal-body">
                    <p>Bạn có chắc muốn xác nhận chỉ số điện nước tháng {{ formatPeriod(filters.period) }} và cập nhật vào hóa đơn tháng tiếp theo?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showConfirmModal = false">Hủy</button>
                    <button class="btn btn-primary" :disabled="isCalculating" @click="calculateAndBill">
                        {{ isCalculating ? 'Đang xử lý...' : 'Xác nhận' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal kết quả -->
    <div class="modal fade show d-block" v-if="showResultModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow">
                <div class="modal-header"
                    :class="resultModalData.success ? 'bg-success text-white' : 'bg-danger text-white'">
                    <h5 class="modal-title">
                        {{ resultModalData.success ? 'Kết quả tính hóa đơn' : 'Lỗi khi tính hóa đơn' }}
                    </h5>
                    <button type="button" class="btn-close" @click="showResultModal = false"></button>
                </div>

                <div class="modal-body">
                    <p class="mb-2">{{ resultModalData.message }}</p>

                    <!-- Hiển thị thông tin chi tiết -->
                    <div v-if="resultModalData.data">
                        <div v-if="resultModalData.data.reading_period" class="small text-muted">
                            <strong>Kỳ đọc:</strong> {{ formatPeriod(resultModalData.data.reading_period) }}
                        </div>
                        <div v-if="resultModalData.data.invoice_period" class="small text-muted">
                            <strong>Kỳ hóa đơn:</strong> {{ formatPeriod(resultModalData.data.invoice_period) }}
                        </div>
                        <div v-if="resultModalData.data.processed !== undefined" class="small text-muted">
                            <strong>Đã xử lý:</strong> {{ resultModalData.data.processed }} căn hộ
                        </div>

                        <!-- Danh sách lỗi -->
                        <div v-if="resultModalData.data.errors?.length" class="mt-3">
                            <div class="fw-bold text-danger">
                                ⚠️ {{ resultModalData.data.errors.length }} lỗi phát sinh:
                            </div>
                            <ul class="mt-2 mb-0 small">
                                <li v-for="(error, idx) in resultModalData.data.errors" :key="idx">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showResultModal = false">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from "~/stores/auth"
import { useApartmentStore } from "~/stores/apartment"
import { useUtilityReadingStore } from "~/stores/utility-reading"
import { useInitialData } from '~/composables/useInitialData'

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    parent: '/utilities',
    breadcrumb: 'Nhập dữ liệu Excel',
})

// State
const filters = ref({
    period: '',
    utilityType: '',
    status: ''
})

// Modal state
const showConfirmModal = ref(false)
const showResultModal = ref(false)
const resultModalData = ref({ success: false, message: '' })

const openConfirmModal = () => {
    showConfirmModal.value = true
}

const authStore = useAuthStore()
const apartmentStore = useApartmentStore()
const utilityReadingStore = useUtilityReadingStore()
const { selectedBuildingId } = useInitialData()

const buildings = ref([])
const apartments = ref([])
const readings = ref([])
const isLoading = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadResult = ref(null)
const showErrors = ref(false)
const isCalculating = ref(false)
const fileInput = ref(null)
const errors = ref({})

const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 50
})

// Computed
const statistics = computed(() => {
    const confirmed = readings.value.filter(r => r.status === 'pending').length

    const utilityTypes = [...new Set(readings.value.map(r => r.utility_type))]

    const total = apartmentStore.apartmentList.length * utilityTypes.length

    return {
        total,
        completed: confirmed,
        missing: total - confirmed
    }
})

const hasConfirmedReadings = computed(() => {
    return readings.value.some(r => r.status === 'pending')
})

const visiblePages = computed(() => {
    const pages = []
    const current = pagination.value.currentPage
    const last = pagination.value.lastPage

    for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
        pages.push(i)
    }
    return pages
})

// Methods
const fetchApartments = async () => {
    try {
        await apartmentStore.apartmentsByBuilding(selectedBuildingId.value)
    } catch (error) {
        console.error('Error fetching apartments:', error)
    }
}

const handleFileDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        selectedFile.value = file
    } else {
        alert('Vui lòng chọn file Excel (.xlsx, .xls)')
    }
}

const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
        selectedFile.value = file
    }
}

const deleteFileSelect = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = '' 
  }
}

const uploadFile = async () => {
    if (!selectedFile.value) return

    if (!filters.value.period) {
        errors.value.period = 'Vui lòng chọn kỳ ghi chỉ số.'
        return
    }

    isUploading.value = true
    uploadProgress.value = 0
    uploadResult.value = null
    readings.value = []

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('period', filters.value.period)
    formData.append('building_id', selectedBuildingId.value)
    //   console.log(Object.fromEntries(formData.entries()));

    try {
        const response = await fetch('http://localhost:8000/api/admin/utilities/import', {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `Bearer ${authStore.token}`
            },
            body: formData
        })

        uploadResult.value = await response.json()

        if (uploadResult.value.data.imported_readings) {
            readings.value = [
                ...uploadResult.value.data.imported_readings,
                ...readings.value
            ]

            pagination.value.total += uploadResult.value.data.success
        }
    } catch (error) {
        uploadResult.value = {
            success: false,
            message: 'Lỗi upload: ' + error.message
        }
    } finally {
        isUploading.value = false
        uploadProgress.value = 100
    }
}

const downloadTemplate = async () => {
    try {
        const response = await fetch('/api/utilities/template')
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Template_DienNuoc_${filters.value.period}.xlsx`
        a.click()
    } catch (error) {
        console.error('Error downloading template:', error)
    }
}

const calculateAndBill = async () => {
    showConfirmModal.value = false
    isCalculating.value = true

    try {
        const data = {
            reading_period: filters.value.period,
            building_id: selectedBuildingId.value
        }
        const result = await utilityReadingStore.calculateAndBill(data)

        // Gán kết quả vào modal
        resultModalData.value = {
            success: result.success,
            message: result.message,
            data: result.data || {}
        }
    } catch (error) {
        resultModalData.value = {
            success: false,
            message: 'Lỗi hệ thống: ' + error.message,
            data: {}
        }
    } finally {
        isCalculating.value = false
        showResultModal.value = true
    }
}

const viewPhoto = (photoUrl) => {
    window.open(photoUrl, '_blank')
}

const goToPage = (page) => {
    if (page >= 1 && page <= pagination.value.lastPage) {
        pagination.value.currentPage = page
        fetchReadings()
    }
}

// Formatters
const formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0)
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0)
}

const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const formatPeriod = (period) => {
    if (!period) return ''
    const [year, month] = period.split('-')
    return `${month}/${year}`
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'warning',
        confirmed: 'success',
        billed: 'secondary'
    }
    return colors[status] || 'secondary'
}

const getStatusText = (status) => {
    const texts = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        billed: 'Đã xuất HĐ'
    }
    return texts[status] || status
}

// Lifecycle
onMounted(() => {
    fetchApartments()
})
</script>

<style scoped>
.upload-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.upload-area:hover,
.upload-area.dragging {
    border-color: #0d6efd;
    background-color: #f8f9fa;
}

.table-sm th,
.table-sm td {
    vertical-align: middle !important;
}

.badge {
    font-size: 0.75rem;
}

.table-hover tbody tr:hover {
    background-color: #f8f9fa;
    transition: 0.2s;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.modal.show {
    display: flex !important;
    align-items: center;
    justify-content: center;
}

.btn-group-sm>.btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.pagination .page-link {
    cursor: pointer;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
