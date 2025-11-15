<template>
  <GlobalLoading />
  <div class="d-flex bg-light">

    <Aside ref="asideRef" :buildings="buildings" :selected-building-id="String(selectedBuildingId)"
      @building-change="handleBuildingChange" @check-building-and-navigate="checkBuildingAndNavigate">
    </Aside>

    <div class="content flex-grow-1">
      <Header :user-info="userInfo" @open-aside="asideRef?.openAside"/>
      <Subheader :items="breadcrumbs" />
      <main>
        <slot />
      </main>
    </div>
    
  </div>
</template>

<script setup>
import { useInitialData } from '@/composables/useInitialData';
import GlobalLoading from '@/components/GlobalLoading.vue';
import Header from '@/layouts/header/Header.vue';
import Aside from '@/layouts/aside/Aside.vue';
import Subheader from '@/layouts/header/Subheader.vue';

const {
  buildings,
  userInfo,
  selectedBuildingId,
  selectedStatsData,
  fetchInitialData,
  handleBuildingChange,
  checkBuildingAndNavigate,
} = useInitialData();

const asideRef = ref(null)
const { breadcrumbs } = useBreadcrumbs()

// await useAsyncData('initial-data', () => {
//   return fetchInitialData()
// });
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

.btn-mobile-menu {
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 2000;
  background: #3a56d4;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 18px;
}
</style>
