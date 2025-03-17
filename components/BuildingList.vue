<template>
  <div class="building-list">
    <h2 class="text-xl font-semibold mb-4">Danh sách tòa nhà</h2>
    
    <!-- Loading state -->
    <div v-if="buildingStore.loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="buildingStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ buildingStore.error }}
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!buildingStore.hasBuildings" class="bg-gray-100 p-8 text-center rounded">
      <p class="text-gray-600">Không có tòa nhà nào được tìm thấy</p>
    </div>
    
    <!-- Building list -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="building in buildingStore.buildings" :key="building.building_id" 
          class="bg-white shadow rounded-lg overflow-hidden">
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <img v-if="building.image" :src="building.image" alt="Building Image" class="w-full h-full object-cover">
          <span v-else class="text-gray-500">Không có hình ảnh</span>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ building.name }}</h3>
          <p class="text-gray-600 mt-2">{{ building.address }}</p>
          <div class="mt-4 flex justify-between">
            <span class="text-sm text-gray-500">Số tầng: {{ building.floors }}</span>
            <span class="text-sm text-gray-500">ID: {{ building.building_id }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="buildingStore.pagination && buildingStore.pagination.lastPage > 1" class="mt-6 flex justify-center">
      <div class="flex space-x-1">
        <button 
          v-for="link in buildingStore.pagination.links" 
          :key="link.label"
          @click="handlePageClick(link)"
          :disabled="!link.url || link.active"
          :class="[
            'px-4 py-2 border rounded',
            link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100',
            !link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
          v-html="link.label"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBuildingStore } from '~/stores/building';

const buildingStore = useBuildingStore();

// Xử lý phân trang
const handlePageClick = (link) => {
  if (!link.url || link.active) return;
  
  // Lấy số trang từ URL
  const url = new URL(link.url);
  const page = url.searchParams.get('page');
  
  if (page) {
    buildingStore.goToPage(parseInt(page));
  }
};

onMounted(() => {
  // Tải danh sách tòa nhà nếu chưa được tải
  if (!buildingStore.hasBuildings && !buildingStore.loading) {
    buildingStore.fetchBuildings();
  }
});
</script>