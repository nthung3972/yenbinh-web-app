<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">Xác nhận chuyển hướng</h3>
                    <button class="close-btn" @click="onCancel">×</button>
                </div>
                <div class="modal-body">
                    <p>Bạn có thay đổi chưa được lưu. Nếu rời đi, các thay đổi của bạn sẽ bị mất.</p>
                    <p>Bạn có chắc chắn muốn rời đi không?</p>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="onCancel">Hủy</button>
                    <button class="confirm-btn" @click="onConfirm">Tiếp tục</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function onConfirm() {
    emit('confirm')
    emit('update:modelValue', false)
}

function onCancel() {
    emit('cancel')
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
}

.modal-body {
    padding: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e2e8f0;
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
