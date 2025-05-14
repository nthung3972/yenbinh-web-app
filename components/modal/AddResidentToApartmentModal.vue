<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay">
            <div class="modal-container">
                <form @submit.prevent="handleSubmit" novalidate>
                    <div class="modal-header">
                        <h3 class="modal-title">Thêm Căn Hộ Mới</h3>
                        <button class="close-btn" type="button" @click="closeModal">×</button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label for="apartment">Chọn căn hộ:</label>
                            <select v-model="form.apartment_number">
                                <option disabled value="">-- Chọn căn hộ --</option>
                                <option v-for="apt in props.apartments" :key="apt.apartment_number"
                                    :value="apt.apartment_number">
                                    {{ apt.apartment_number }}
                                </option>
                            </select>

                            <div v-if="props.errors?.apartment_number" class="text-danger">
                                {{ props.errors.apartment_number }}
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Loại sở hữu</label>
                            <select v-model="form.role_in_apartment">
                                <option value="">Chọn vai trò</option>
                                <option :value="0">Chủ hộ</option>
                                <option :value="2">Người thân</option>
                                <option :value="1">Người thuê chính</option>
                                <option :value="3">Người thuê</option>
                            </select>
                            <span v-if="errors?.role_in_apartment" class="error-message">
                                {{ errors.role_in_apartment }}
                            </span>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="cancel-btn">Hủy</button>
                        <button type="submit" class="confirm-btn">Thêm</button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    errors: Object,
    apartments: Array
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({
    apartment_number: '',
    role_in_apartment: ''
})

function resetForm() {
    form.apartment_number = ''
    form.role_in_apartment = ''
}

function closeModal() {
    emit('update:modelValue', false)
    resetForm()
}

watch(() => props.modelValue, (newVal) => {
    if (newVal) resetForm()
})


function handleSubmit() {
    emit('submit', { ...form })
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    overflow: hidden;
}

.modal-header,
.modal-footer {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 16px;
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
}

.close-btn {
    background: none;
    font-size: 24px;
    border: none;
    cursor: pointer;
}

.form-group {
    margin-bottom: 1rem;
}

input,
select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #cbd5e0;
}

.error-message {
    color: #e53e3e;
    font-size: 13px;
}

.cancel-btn {
    background: #e2e8f0;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}

.confirm-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}
</style>
