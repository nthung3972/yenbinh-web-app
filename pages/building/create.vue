<template>
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border spinner-border-sm me-2" role="status">
        <span class="visually-hidden">Đang tải dữ liệu...</span>
      </div>
      <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>

    <div class="container form-container">
        <div class="card">
            <div class="card-header d-flex align-items-center">
                <i class="fas fa-building header-icon fs-4 text-white"></i>
                <h4 class="mb-0 text-white">Thêm tòa nhà mới</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="createBuilding">
                    <div class="form-section">
                        <h5 class="section-title"><i class="fas fa-info-circle me-2"></i>Thông tin cơ bản</h5>
                        <div class="row g-3">
                            <div class="col-md-12">
                                <div class="form-label-group">
                                    <input v-model="buildingForm.name" type="text" class="form-control" id="buildingName"
                                        placeholder=" ">
                                    <label for="buildingName">Tên tòa nhà<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['name']" class="text-danger">
                                        {{ errors?.['name'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="buildingForm.floors" type="number" min="1" class="form-control" id="floorsInput"
                                        placeholder=" ">
                                    <label for="floorsInput">Số tầng<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['floors']" class="text-danger">
                                        {{ errors?.['floors'][0] }}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="buildingForm.total_area" type="number" min="1" class="form-control" id="floorsInput"
                                        placeholder=" ">
                                    <label for="floorsInput">Diện tích<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['total_area']" class="text-danger">
                                        {{ errors?.['total_area'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mt-2">
                            <div class="col-12">
                                <div class="form-label-group">
                                    <textarea v-model="buildingForm.address" class="form-control" id="addressInput" rows="3"
                                        placeholder=" "></textarea>
                                    <label for="addressInput">Địa chỉ tòa nhà<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors?.['address']" class="text-danger">
                                        {{ errors?.['address'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h5 class="section-title"><i class="fas fa-image me-2"></i>Hình ảnh tòa nhà</h5>
                        <div class="row">
                            <div class="col-12">
                                <div class="image-upload-container" id="imageUploadContainer">
                                    <!-- <input type="file" class="file-input" id="buildingImage" accept="image/*"> -->
                                    <input type="file" @change="handleFileChange" accept="image/*" />
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <h5>Tải lên hình ảnh tòa nhà</h5>
                                    <p class="text-muted">Kéo thả hoặc nhấp vào đây để tải lên</p>
                                    <p class="text-muted small">Hỗ trợ JPG, PNG, tối đa 5MB</p>
                                    <img v-if="buildingForm.imagePreview" :src="buildingForm.imagePreview" alt="Xem trước ảnh" style="max-width: 200px; margin-top: 10px;"/>
                                </div>
                                <small v-if="errors?.['image']" class="text-danger">
                                    {{ errors?.['image'][0] }}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h5 class="section-title"><i class="fas fa-sliders me-2"></i>Trạng thái & Cài đặt</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <select v-model="buildingForm.status" class="form-select" id="statusSelect">
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
                                    <select v-model="buildingForm.building_type" class="form-select" id="typeSelect">
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

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button type="button" class="btn btn-secondary px-4 me-2" @click="back()">
                            <i class="fas fa-times me-1"></i> Hủy
                        </button>
                        <button type="submit" class="btn btn-primary px-4">
                            <i class="fas fa-save me-1"></i> Thêm tòa nhà
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/building'
import { useUploadStore } from '@/stores/upload'
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const router = useRouter()
const buildingStore = useBuildingStore()
const uploadStore = useUploadStore()
const toast = useToast()
const errors = ref('')


const isLoading = computed(() => buildingStore.isLoading);
const hasError = computed(() => buildingStore.hasError);

const buildingForm = ref({
  name: '',
  address: '',
  image: null,
  floors: '',
  total_area: '',
  status: '',
  building_type: '',
  imagePreview: null
})

const reset = () => {
    buildingForm.value.name = '',
    buildingForm.value.address = '',
    buildingForm.value.image = '',
    buildingForm.value.floors = '',
    buildingForm.value.total_area = '',
    buildingForm.value.status = '',
    buildingForm.value.building_type = '',
    errors.value = ''
}

const back = () => {
    router.back()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  buildingForm.value.imagePreview = URL.createObjectURL(file)

  console.log(buildingForm.value.imagePreview)

  const formData = new FormData()
  formData.append('image', file)

  try {
    const result = await uploadStore.uploadImage(formData)
    buildingForm.value.imagePreview = result.path
    buildingForm.value.image = result.path
  } catch (error) {
    console.error('Lỗi upload ảnh:', error)
  }
}

const createBuilding = async () => {
    console.log(buildingForm.value);
  try {
    await buildingStore.createBuilding(buildingForm.value)
    toast.success('Thêm tòa nhà thành công!')
    reset()
  } catch (error) {
    console.log(error.errors);
    errors.value = error.errors
    toast.error('Đã xảy ra lỗi khi thêm tòa nhà!')
  }
}
</script>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 0 auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    background: linear-gradient(45deg, #4e73df, #224abe);
    padding: 1.5rem;
    border-bottom: none;
}

.card-body {
    padding: 2rem;
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
    margin-bottom: 2rem;
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