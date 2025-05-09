<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="container form-container">
        <div class="card">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:office-building" size="24" class="me-2" />
                    Sửa thông tin tòa nhà
                </h4>
                <button class="btn btn-outline-secondary" @click="back()">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateBuilding">
                    <div class="form-section row">
                        <div class="col-md-4 d-flex flex-column border-end">
                            <div class="form-section">
                                <h5 class="section-title"><i class="fas fa-image me-2"></i>Hình ảnh tòa nhà</h5>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="image-upload-container" id="imageUploadContainer">
                                            <input type="file" @change="handleFileChange" accept="image/*" @input="onChange()"/>

                                            <!-- Hiển thị khi có ảnh preview mới -->
                                            <div v-if="buildingForm.imagePreview" class="current-image-container">
                                                <img :src="buildingForm.imagePreview" alt="Xem trước ảnh"
                                                    class="image-preview" />
                                            </div>

                                            <!-- Hiển thị khi có ảnh cũ và không có ảnh preview -->
                                            <div v-else-if="buildingForm.image" class="current-image-container">
                                                <img :src="buildingForm.image" alt="Ảnh hiện tại"
                                                    class="current-image" />
                                            </div>

                                            <!-- Hiển thị khi không có cả ảnh cũ và ảnh preview -->
                                            <div v-else class="upload-placeholder">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                                <h5>Tải lên hình ảnh tòa nhà</h5>
                                                <p class="text-muted">Kéo thả hoặc nhấp vào đây để tải lên</p>
                                                <p class="text-muted small">Hỗ trợ JPG, PNG, tối đa 5MB</p>
                                            </div>
                                        </div>
                                        <small v-if="errors?.['image']" class="text-danger">
                                            {{ errors?.['image'][0] }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-8">
                            <h5 class="section-title"><i class="fas fa-info-circle me-2"></i>Thông tin cơ bản</h5>
                            <div class="row g-3">
                                <div class="col-md-12">
                                    <div class="form-label-group">
                                        <input v-model="buildingForm.name" type="text" class="form-control" @input="onChange()"
                                            id="buildingName" placeholder=" ">
                                        <label for="buildingName">Tên tòa nhà<span
                                                class="required-mark">*</span></label>
                                        <small v-if="errors?.['name']" class="text-danger">
                                            {{ errors?.['name'][0] }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <input v-model="buildingForm.floors" type="number" min="1" class="form-control" @input="onChange()"
                                            id="floorsInput" placeholder=" ">
                                        <label for="floorsInput">Số tầng<span class="required-mark">*</span></label>
                                        <small v-if="errors?.['floors']" class="text-danger">
                                            {{ errors?.['floors'][0] }}
                                        </small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <input v-model="buildingForm.total_area" type="number" min="1" @input="onChange()"
                                            class="form-control" id="floorsInput" placeholder=" ">
                                        <label for="floorsInput">Diện tích<span class="required-mark">*</span></label>
                                        <small v-if="errors?.['total_area']" class="text-danger">
                                            {{ errors?.['total_area'][0] }}
                                        </small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <input v-model="buildingForm.management_fee_per_m2" type="number" min="1" @input="onChange()"
                                            class="form-control" id="floorsInput" placeholder=" ">
                                        <label for="floorsInput">Giá dịch vụ<span class="required-mark">*</span></label>
                                        <small v-if="errors?.['management_fee_per_m2']" class="text-danger">
                                            {{ errors?.['management_fee_per_m2'][0] }}
                                        </small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <input v-model="buildingForm.management_board_fee_per_m2" type="number" @input="onChange()"
                                            class="form-control" id="floorsInput" placeholder=" ">
                                        <label for="floorsInput">Thù lao Ban quản trị<span
                                                class="required-mark">*</span></label>
                                        <small v-if="errors?.['management_board_fee_per_m2']" class="text-danger">
                                            {{ errors?.['management_board_fee_per_m2'][0] }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-12">
                                    <div class="form-label-group">
                                        <textarea v-model="buildingForm.address" class="form-control" id="addressInput" @input="onChange()"
                                            rows="3" placeholder=" "></textarea>
                                        <label for="addressInput">Địa chỉ tòa nhà<span
                                                class="required-mark">*</span></label>
                                        <small v-if="errors?.['address']" class="text-danger">
                                            {{ errors?.['address'][0] }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <h5 class="section-title"><i class="fas fa-sliders me-2"></i>Trạng thái & Cài đặt</h5>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <select v-model="buildingForm.status" class="form-select" id="statusSelect" @change="onChange()">
                                            <option value="" disabled selected>Chọn trạng thái</option>
                                            <option value="0">Đang hoạt động</option>
                                            <option value="1">Không hoạt động</option>
                                        </select>
                                        <label for="statusSelect">Trạng thái<span class="required-mark">*</span></label>
                                        <small v-if="errors?.['status']" class="text-danger">
                                            {{ errors?.['status'][0] }}
                                        </small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-label-group">
                                        <select v-model="buildingForm.building_type" class="form-select" @change="onChange()"
                                            id="typeSelect">
                                            <option value="" disabled selected>Chọn loại tòa nhà</option>
                                            <option value="residential">Chung cư</option>
                                            <option value="commercial">Văn phòng</option>
                                            <option value="mixed">Hỗn hợp</option>
                                        </select>
                                        <label for="typeSelect">Loại tòa nhà</label>
                                        <small v-if="errors?.['building_type']" class="text-danger">
                                            {{ errors?.['building_type'][0] }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button type="button" class="btn btn-secondary" @click="reset()">
                            <Icon name="system-uicons:reset" size="20" class="me-2" />
                            Làm mới
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <Icon name="mingcute:save-line" size="20" class="me-2" />
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useBuildingStore } from '@/stores/building'
import { useUploadStore } from '@/stores/upload'
import { useToast } from 'vue-toastification'
import { ref, onMounted } from 'vue'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const router = useRouter()
const buildingStore = useBuildingStore()
const uploadStore = useUploadStore()
const toast = useToast()
const errors = ref('')
const route = useRoute()
const buildingId = route.params.id

const isLoading = computed(() => buildingStore.isLoading)

const buildingForm = ref({
    name: '',
    address: '',
    image: null,
    floors: '',
    total_area: '',
    management_fee_per_m2: '',
    management_board_fee_per_m2: '',
    status: '',
    building_type: '',
    imagePreview: null
})

const {
    hasUnsavedChanges,
    showConfirmModal,
    setupRouteGuard,
    setEditing,
    confirmNavigation,
    cancelNavigation,
    navigateSafely
} = useUnsavedChangesGuard()

const onChange = () => {
    setEditing(true)
}

const reset = () => {
    buildingForm.value.name = ''
    buildingForm.value.address = ''
    buildingForm.value.floors = ''
    buildingForm.value.total_area = ''
    buildingForm.value.management_fee_per_m2 = ''
    buildingForm.value.management_board_fee_per_m2 = ''
    buildingForm.value.status = ''
    buildingForm.value.building_type = ''
    setEditing(true)
}

const back = () => {
    router.back()
}

const getBuilding = async () => {
    try {
        await buildingStore.getBuilding(buildingId)
        buildingForm.value = {
            ...buildingStore.building,
        }
    } catch (error) {
        toast.error('Không tìm thấy tòa nhà!')
        router.push('/building')
    }
}

const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (!file) return

    buildingForm.value.imagePreview = URL.createObjectURL(file)

    console.log(buildingForm.value.imagePreview)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', 'buildings')
    if (buildingForm.value.image) {
        formData.append('old_path', buildingForm.value.image)
    }; 

    try {
        isLoading.value = true
        const result = await uploadStore.uploadImage(formData)
        // buildingForm.value.imagePreview = result.path
        buildingForm.value.image = result.path
    } catch (error) {
        console.error('Lỗi upload ảnh:', error)
    } finally {
        isLoading.value = false
    }
}

const updateBuilding = async () => {
    try {
        await buildingStore.updateBuilding(buildingId, buildingForm.value)
        toast.success('Sửa thông tin thành công!')
        setEditing(false)
        errors.value = null
        router.push('/building')
    } catch (error) {
        errors.value = error.errors
        toast.error('Đã xảy ra lỗi khi sửa thông tin tòa nhà!')
    }
}

onMounted(() => {
    getBuilding()
    setupRouteGuard()
})
</script>

<style scoped>
.form-container {
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    /* background: linear-gradient(45deg, #4e73df, #224abe); */
    border-bottom: 2px solid #eaecf4;
    padding: 12px 24px;
}

.card-body {
    padding: 16px 24px;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
    padding: 0.75rem;
    border-radius: 7px;
    border: 1px solid #ced4da;
    transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 7px 0 0 7px;
}

.btn-primary {
    background: linear-gradient(45deg, #4e73df, #224abe);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    border-radius: 7px;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: linear-gradient(45deg, #224abe, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.required-mark {
    color: #dc3545;
    margin-left: 3px;
}

.help-text {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.header-icon {
    margin-right: 10px;
}

.form-section {
    margin-bottom: 0;
}

.section-title {
    font-size: 1.1rem;
    color: #4e73df;
    border-bottom: 2px solid #eaecf4;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

/* Form label group để tránh đè label */
.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    padding: 0.75rem;
    color: #495057;
    pointer-events: none;
    cursor: text;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
}

.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:not(:placeholder-shown)~label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #4e73df;
    background-color: white;
    top: -10px;
    left: 10px;
    z-index: 1;
    padding-left: 5px;
    padding-right: 5px;
}

/* Styling cho phần tải ảnh */
.image-upload-container {
    position: relative;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
}

.image-upload-container img {
    width: 100%;
    height: 100%;
}

.image-upload-container:hover {
    border-color: #999;
}

.image-upload-container input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
}

.image-upload-container i {
    font-size: 48px;
    color: #6c757d;
    margin-bottom: 10px;
}

.image-upload-container h5 {
    margin-bottom: 5px;
    color: #333;
}

.image-upload-container p {
    margin-bottom: 5px;
}

.image-upload-container .text-muted {
    color: #6c757d !important;
}

.image-upload-container .small {
    font-size: 0.875em;
}
</style>