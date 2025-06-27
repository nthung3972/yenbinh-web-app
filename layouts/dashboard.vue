<template>
  <GlobalLoading />
  <div class="d-flex bg-light">
      <Sidebar :buildings="buildings" :selected-building-id="String(selectedBuildingId)" @building-change="handleBuildingChange"
      @check-building-and-navigate="checkBuildingAndNavigate" />
    <div class="content flex-grow-1">
      <Header :user-info="userInfo?.user" />
      <main>
        <slot />
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

await useAsyncData('initial-data', () => {
  return fetchInitialData()
});
</script>

<style>
main {
    margin: 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    height: calc(100% - 135px);
}
.content {
    width: calc(100% - 250px);
    max-height: 100vh;
    overflow-y: hidden;
}

slot {
    width: calc(100% - 250px);
}
</style>