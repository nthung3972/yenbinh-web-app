<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo">ApartManager</h2>
      <select v-model="selectedBuilding" class="building-select">
        <option value="all">Tất cả tòa nhà</option>
        <option v-for="building in buildingStore.buildings" :key="building.id" :value="building.id">
          {{ building.name }}
        </option>
      </select>

      <button @click="logout">
        Logout
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <header class="topbar">
        <h1 class="dashboard-title">Dashboard</h1>
        <span class="subtitle">Quản lý tổng thể các tòa nhà</span>
        <div class="search-bar">
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <div class="user-avatar">TT</div>
      </header>

      <nav class="tab-nav">
        <ul>
          <li :key="'all'" @click="activeTab = 'all'" :class="{ active: activeTab === 'all' }">
            Tất cả tòa nhà
          </li>
          <li v-for="building in buildingStore.buildings" :key="building.name" @click="activeTab = building.name"
            :class="{ active: activeTab === building.name }">
            {{ building.name }}
          </li>
        </ul>
      </nav>

      <section>
        <component :is="getActiveComponent"></component>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import AuthService from '~/services/auth.service';
import { useBuildingStore } from "~/stores/building";
import { ref, computed, defineAsyncComponent } from 'vue';

definePageMeta({
  middleware: "auth",
});

const selectedBuilding = ref('all');
const activeTab = ref('all');

const buildingStore = useBuildingStore();

const getActiveComponent = computed(() => {
  return activeTab.value === 'all'
    ? defineAsyncComponent(() => import('@/components/building/DashboardAll.vue'))
    : defineAsyncComponent(() => import('@/components/building/DashboardBuilding.vue'));
});

const logout = async () => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

onMounted(async () => {
  await buildingStore.fetchBuildings();
});
</script>

<style scoped>
.dashboard {
  display: flex;
}

.sidebar {
  width: 250px;
  background: #3b5bfd;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.building-select {
  padding: 8px;
  border-radius: 5px;
  border: none;
}

.content {
  flex: 1;
  padding: 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.search-bar input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.user-avatar {
  background: #3b5bfd;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tab-nav ul {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
}

.tab-nav ul li {
  cursor: pointer;
  padding: 8px 15px;
}

.tab-nav ul li.active {
  border-bottom: 2px solid #3b5bfd;
  color: #3b5bfd;
  font-weight: bold;
}
</style>
