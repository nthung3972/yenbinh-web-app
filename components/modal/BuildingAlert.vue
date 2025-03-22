<script setup>
import { useModalStore } from '@/stores/ModalStore'

const modalStore = useModalStore()
</script>

<template>
  <div v-if="modalStore.showBuildingAlert" class="modal">
    <div class="modal-content">
      <p>⚠️ Vui lòng chọn tòa nhà trước khi sử dụng tính năng này!</p>
      <button @click="modalStore.closeBuildingAlert">OK</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: red;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>