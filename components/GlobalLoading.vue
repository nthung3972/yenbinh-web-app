<template>
    <div v-if="loadingStore.isLoading" class="loader-wrapper">
        <div class="loader"></div>
    </div>
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
</script>

<style scoped>
/* Paste CSS ở đây */
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>