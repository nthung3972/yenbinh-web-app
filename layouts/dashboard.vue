<template>
  <GlobalLoading />
  <div class="d-flex bg-light">
    <!-- <Sidebar :buildings="buildings" :selected-building-id="selectedBuildingId" @building-change="handleBuildingChange" -->
      <Sidebar :buildings="buildings" :selected-building-id="selectedBuildingId" @building-change="handleBuildingChange"
      @check-building-and-navigate="checkBuildingAndNavigate" />
    @check-building-and-navigate="checkBuildingAndNavigate" />
    <div class="content flex-grow-1">
      <Header :user-info="userInfo" />
      <main>
        <slot :stats-data="selectedStatsData" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
import GlobalLoading from '@/components/GlobalLoading.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Header from '@/components/header/Header.vue';

const {
  buildings,
  userInfo,
  selectedBuildingId,
  selectedStatsData,
  fetchInitialData,
  handleBuildingChange,
  checkBuildingAndNavigate,
} = useInitialData();

onMounted(() => {
  fetchInitialData();
});
</script>