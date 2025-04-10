<template>
    <div>
        <h2 class="fw-bold">Dashboard</h2>
  
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <div v-else>
            <DashboardStats :data="selectedStatsData" />
            <DashboardTable :data="selectedStatsData" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue';
  import DashboardStats from '~/components/dashboard/DashboardStats.vue';
  import DashboardTable from '~/components/dashboard/DashboardTable.vue';
  import { useDashboardStore } from '~/stores/dashboard';
  
  definePageMeta({
    middleware: "auth",
    layout: "dashboard"
  });
  
  const dashboardStore = useDashboardStore();
  
  const selectedBuilding = computed(() => dashboardStore.getSelectedBuildingId);
  const selectedStatsData = computed(() => {
      return selectedBuilding.value === 'all' ? dashboardStore.getData : dashboardStore.getStatsBuilding;
  });
//   console.log('selectedStatsData', selectedStatsData)
  const isLoading = computed(() => dashboardStore.isLoading);
  const hasError = computed(() => dashboardStore.hasError);
  
  // Theo dõi sự thay đổi của `selectedBuilding` và cập nhật dữ liệu
  watch(selectedBuilding, async (newBuildingId) => {
      if (newBuildingId === 'all') {
          await dashboardStore.fetchStatsBuildings();
      } else {
          await dashboardStore.fetchStatsBuilding(newBuildingId);
      }
  }, { immediate: true }); // `immediate: true` để gọi ngay lần đầu
  
  </script>