<template>
  <div class="container form-container">
    <div class="card">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h4 class="fw-bold text-primary">
          <Icon name="guidance:care-staff-area" size="24" />
          Thêm nhân viên mới
        </h4>
        <button class="btn btn-outline-secondary" @click="goBack()">
          <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
          Quay lại
        </button>
      </div>
      <div class="card-body">
        <form @submit.prevent="createStaff">
          <div class="form-section">
            <h5 class="section-title"><i class="fas fa-user me-2"></i>Thông tin cơ bản</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.name" type="text" class="form-control" id="nameInput" @input="onChange()"
                    placeholder="Nhập tên nhân viên">
                  <label for="nameInput">Tên nhân viên<span class="required-mark">*</span></label>
                  <small v-if="errors['name']" class="text-danger">
                    {{ errors['name'][0] }}
                  </small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.email" type="email" class="form-control" id="emailInput" @input="onChange()"
                    placeholder="Nhập email">
                  <label for="emailInput">Email<span class="required-mark">*</span></label>
                  <small v-if="errors['email']" class="text-danger">
                    {{ errors['email'][0] }}
                  </small>
                </div>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.address" type="text" class="form-control" id="nameInput" @input="onChange()"
                    placeholder="Nhập địa chỉ">
                  <label for="nameInput">Địa chỉ<span class="required-mark">*</span></label>
                  <small v-if="errors['address']" class="text-danger">
                    {{ errors['address'][0] }}
                  </small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.phone_number" type="text" class="form-control" id="emailInput" @input="onChange()"
                    placeholder="Nhập số điện thoại">
                  <label for="emailInput">Số điện thoại<span class="required-mark">*</span></label>
                  <small v-if="errors['phone_number']" class="text-danger">
                    {{ errors['phone_number'][0] }}
                  </small>
                </div>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.password" type="password" class="form-control" id="passwordInput" @input="onChange()"
                    placeholder="Nhập mật khẩu">
                  <label for="passwordInput">Mật khẩu<span class="required-mark">*</span></label>
                  <div class="help-text">Mật khẩu phải có ít nhất 8 ký tự</div>
                  <small v-if="errors['password']" class="text-danger">
                    {{ errors['password'][0] }}
                  </small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <input v-model="staffForm.password_confirmation" type="password" class="form-control" @input="onChange()"
                    id="confirmPassword" placeholder="Nhập lại mật khẩu">
                  <label for="confirmPassword">Xác nhận mật khẩu<span class="required-mark">*</span></label>
                  <small v-if="errors['password_confirmation']" class="text-danger">
                    {{ errors['password_confirmation'][0] }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h5 class="section-title"><i class="fas fa-building me-2"></i>Thông tin công việc</h5>
            <div v-for="(detail, index) in buildingsForm" :key="index">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="buildingSelect">Chọn tòa nhà<span class="required-mark">*</span></label>
                  <div class="form-floating mb-3">
                    <select v-model="detail.building_id" class="form-select" id="buildingSelect" @change="onChange()"> 
                      <option value="" disabled selected>Chọn tòa nhà</option>
                      <option v-for="building in selectedStatsData" :key="building.building_id"
                        :value="building.building_id">{{
                          building.name }}</option>
                    </select>
                    <small v-if="errors[`buildings.${index}.building_id`]" class="text-danger">
                      {{ errors[`buildings.${index}.building_id`][0] }}
                    </small>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="roleSelect">Vai trò</label>
                  <div class="form-floating mb-3">
                    <select v-model="detail.role" class="form-select" id="roleSelect" @change="onChange()">
                      <option value="" disabled selected>Chọn vai trò</option>
                      <option value="manager">Quản lý</option>
                      <option value="monitor">Giám sát</option>
                    </select>
                    <small v-if="errors[`buildings.${index}.role`]" class="text-danger">
                      {{ errors[`buildings.${index}.role`][0] }}
                    </small>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <textarea v-model="detail.assigned_tasks" class="form-control" placeholder="Nhập nhiệm vụ" @input="onChange()"
                      id="tasksInput" style="height: 100px"></textarea>
                    <label for="tasksInput">Nhiệm vụ được giao</label>
                    <div class="help-text">Nhập từng nhiệm vụ, cách nhau bằng dấu phẩy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
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
import { ref, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useInitialData } from '@/composables/useInitialData'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const staffStore = useStaffStore()
const errors = ref({})
const toast = useToast()
const router = useRouter()

const {
  selectedStatsData,
} = useInitialData();

const staffForm = ref({
  name: '',
  email: '',
  address: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
  role: 'staff',
  buildings: []
})

const buildingsForm = ref([
  { building_id: '', role: '', assigned_tasks: '' }
])

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
  staffForm.value.name = '',
  staffForm.value.email = '',
  staffForm.value.address = '',
  staffForm.value.phone_number = '',
  staffForm.value.password = '',
  staffForm.value.password_confirmation = '',
  buildingsForm.value.building_id = '',
  buildingsForm.value.role = '',
  buildingsForm.value.assigned_tasks = ''
  errors.value = ''
  setEditing(false)
}

const goBack = () => {
  router.back();
}

const createStaff = async () => {
  const createData = {
    ...staffForm.value,
    buildings: buildingsForm.value
  }
  try {
    await staffStore.createStaff(createData)
    toast.success('Thêm nhân viên thành công!')
    setEditing(false)
    reset()
  } catch (error) {
    errors.value = error.errors
    toast.error('Đã xảy ra lỗi khi thêm nhân viên!')
  }
}

onMounted(() => {
    setupRouteGuard()
})
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
  padding: 1.5rem;
  border-bottom: 2px solid #eaecf4;
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

/* Sửa lỗi đè label */
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
</style>