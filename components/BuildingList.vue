<template>
  <!-- <div>
    <h2>Danh sách tòa nhà</h2>

    <p v-if="buildingStore.loading">Đang tải dữ liệu...</p>

    <p v-if="buildingStore.error" class="error">{{ buildingStore.error }}</p>

    <table v-if="buildingStore.hasBuildings" border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>Số tầng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="building in buildingStore.buildings" :key="building.building_id">
          <td>{{ building.building_id }}</td>
          <td>{{ building.name }}</td>
          <td>{{ building.address }}</td>
          <td>{{ building.floors }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="buildingStore.pagination" class="pagination">

      <button @click="prevPage" :disabled="!buildingStore.pagination?.prev_page_url">
        Trang Trước
      </button>

      <button @click="nextPage" :disabled="!buildingStore.pagination?.next_page_url">
        Trang Sau
      </button>
    </div>
  </div> -->
</template>


<script setup>
import { onMounted } from "vue";
import { useBuildingStore } from "~/stores/building"; 

const buildingStore = useBuildingStore(); 

onMounted(async () => {
  await buildingStore.fetchBuildings(); 
});

const nextPage = () => {
  console.log("Pagination object:", buildingStore.pagination);
  console.log("Current page:", buildingStore.pagination?.current_page);

  if (buildingStore.pagination?.next_page_url) {
    const nextPage = buildingStore.pagination.current_page + 1;
    console.log("Next page:", nextPage);
    buildingStore.fetchBuildings(nextPage);
  }
};

const prevPage = () => {
  if (buildingStore.pagination?.prev_page_url) {
    const prevPage = buildingStore.pagination.current_page - 1;
    console.log("Previous page:", prevPage);
    buildingStore.fetchBuildings(prevPage);
  }
};
</script>
