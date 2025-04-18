<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">{{ title }}</h3>
                    <button class="close-btn" @click="onCancel">×</button>
                </div>

                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click="onCancel">Hủy</button>
                    <button class="confirm-btn" @click="onConfirm">{{ confirmText }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: 'Xác nhận'
    },
    message: {
        type: String,
        default: 'Bạn có chắc chắn muốn tiếp tục?'
    },
    confirmText: {
        type: String,
        default: 'Xác nhận'
    }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const onConfirm = () => {
    emit('confirm')
    emit('update:modelValue', false)
}

const onCancel = () => {
    emit('cancel')
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.modal-header,
.modal-footer {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-footer {
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.modal-body {
    padding: 16px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    float: right;
    cursor: pointer;
    color: #64748b;
}

.cancel-btn,
.confirm-btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.cancel-btn {
    background-color: #e2e8f0;
    border: none;
}

.confirm-btn {
    background-color: #ef4444;
    color: white;
    border: none;
}
</style>
