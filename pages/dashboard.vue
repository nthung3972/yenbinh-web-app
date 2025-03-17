<template>
    <div class="dashboard p-4">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
      <p class="text-gray-600 mb-4">Chào mừng bạn đến với trang quản lý!</p>
      <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
        Đăng xuất
      </button>
    </div>

    <BuildingList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '~/services/auth.service';
import { useBuildingStore } from "~/stores/building";

definePageMeta({
    middleware: "auth", // Gọi middleware auth.js
});

const buildingStore = useBuildingStore();

const logout = async () => {
    try {
        await AuthService.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

onMounted(() => {
    
});
</script>