<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            <Icon name="ph:note-pencil" class="header-icon" />
            {{ isEdit ? 'Cập nhật phí con' : 'Thêm phí con (' + selectedFeeTypeName + ')'}}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <!-- Trạng thái -->
            <div class="form-label-group mb-3">
              <select v-model="form.fee_types_id" class="form-select" id="statusSelect">
                <option v-if="editData" v-for="feeType in feeTypeStore.feeTypes" :key="feeType.fee_types_id"
                  :value="feeType.fee_types_id">
                  {{ feeType.name }}
                </option>
                <option :value="props.feeTypeId">{{ selectedFeeTypeName }}</option>
              </select>
              <label for="statusSelect">
                Tên loại phí<span class="required-mark">*</span>
              </label>
              <small v-if="errors?.['fee_types_id']" class="text-danger">
                {{ errors?.['fee_types_id'][0] }}
              </small>
            </div>

            <!-- Mã loại phí -->
            <div class="form-label-group mb-3">
              <input v-model="form.code" type="text" class="form-control" id="codeInput" placeholder=" " />
              <label for="codeInput">
                Mã phí con<span class="required-mark">*</span>
              </label>
              <small v-if="errors?.['code']" class="text-danger">
                {{ errors?.['code'][0] }}
              </small>
            </div>

            <!-- Tên loại phí -->
            <div class="form-label-group mb-3">
              <input v-model="form.name" type="text" class="form-control" id="nameInput" placeholder=" " />
              <label for="nameInput">
                Tên phí con<span class="required-mark">*</span>
              </label>
              <small v-if="errors?.['name']" class="text-danger">
                {{ errors?.['name'][0] }}
              </small>
            </div>

            <!-- Tên loại phí -->
            <div class="form-label-group mb-3">
              <input v-model="form.unit" type="text" class="form-control" id="unitInput" placeholder=" " />
              <label for="unitInput">
                Đơn vị tính<span class="required-mark">*</span>
              </label>
              <small v-if="errors?.['unit']" class="text-danger">
                {{ errors?.['unit'][0] }}
              </small>
            </div>

            <!-- Mô tả -->
            <div class="form-label-group mb-3">
              <textarea v-model="form.note" class="form-control" id="noteInput" rows="4" placeholder=" "></textarea>
              <label for="noteInput">Ghi chú</label>
              <small v-if="errors?.['note']" class="text-danger">
                {{ errors?.['note'][0] }}
              </small>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="emit('close')">Hủy</button>
          <button class="btn btn-primary" @click="saveData" :disabled="loading">
            {{ loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Lưu mới') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useFeeSubtypeStore } from '@/stores/fee-subtype'
import { useFeeTypeStore } from '@/stores/fee-type'

const props = defineProps({
  editData: Object,
  feeTypeId: Number,
})

const emit = defineEmits(['saved', 'close'])
const toast = useToast()
const feeSubtypeStore = useFeeSubtypeStore()
const feeTypeStore = useFeeTypeStore()

const form = ref({
  fee_types_id: '',
  code: '',
  name: '',
  unit: '',
  note: '',
})

const errors = ref({})
const loading = ref(false)
const isEdit = computed(() => !!props.editData)

const selectedFeeTypeName = computed(() => {
  return feeTypeStore.feeTypes.find(ft => ft.fee_types_id === props.feeTypeId)?.name
})

watch(
  [() => props.editData, () => props.feeTypeId],
  ([editData, feeTypeId]) => {
    if (editData) {
      form.value = { ...editData }
    }
    if (feeTypeId && !editData) {
      form.value.fee_types_id = feeTypeId
    }
  },
  { immediate: true }
)

const saveData = async () => {
  loading.value = true
  errors.value = {}

  try {
    if (isEdit.value) {
      await feeSubtypeStore.updateFeeSubtype(props.editData.fee_subtypes_id, form.value)
      toast.success('Cập nhật phí con thành công')
    } else {
      await feeSubtypeStore.createFeeSubtype(form.value)
      toast.success('Thêm phí con thành công')
    }
    emit('saved')
    emit('close')
  } catch (error) {
    errors.value = error.errors
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-content {
  border: none;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 2px solid #eaecf4;
  background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
}

.modal-title {
  color: #4e73df;
}

.header-icon {
  margin-right: 10px;
  vertical-align: middle;
}

.modal-body {
  padding: 2rem;
  background-color: #ffffff;
}

.form-section {
  width: 100%;
}

/* Form Label Group - Floating Label Effect */
.form-label-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-label-group>label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: auto;
  margin-bottom: 0;
  padding: 0.75rem;
  color: #6c757d;
  pointer-events: none;
  cursor: text;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out;
  background-color: transparent;
  z-index: 1;
}

/* Input, Textarea, Select Styles */
.form-control,
.form-select {
  border-radius: 7px;
  border: 1px solid #ced4da;
  padding: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #ffffff;
  position: relative;
}

.form-control:focus,
.form-select:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

/* Floating Label on Focus or When Filled */
.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:not([value=""])~label,
.form-label-group select:valid~label {
  top: -10px;
  left: 10px;
  padding: 0 5px;
  font-size: 12px;
  font-weight: 600;
  color: #4e73df;
  background-color: white;
  z-index: 2;
}

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 3px;
  font-weight: bold;
}

/* Error Messages */
.text-danger {
  display: block;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Textarea Specific */
textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Select Specific */
.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
}

.form-select:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%234e73df' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
}

/* Modal Footer */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #eaecf4;
  background-color: #f8f9fc;
}

/* Button Styles */
.btn {
  border-radius: 7px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(45deg, #4e73df, #224abe);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(45deg, #224abe, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #858796;
  border: none;
  color: white;
}

.btn-secondary:hover {
  background-color: #6c757d;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

/* Close Button */
.btn-close {
  transition: all 0.2s;
}

.btn-close:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-header,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
