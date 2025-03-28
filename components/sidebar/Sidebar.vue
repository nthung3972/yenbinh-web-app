<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
            <h2 class="logo">BuildingManager</h2>
        </div>

        <!-- Dropdown chọn tòa nhà -->
        <div class="sidebar-select">
            <select v-model="selectedBuilding" @change="handleBuildingChange()" class="form-select">
                <option value="all">Tất cả tòa nhà</option>
                <option v-for="building in dashboardStore.getData" :key="building.building_id"
                    :value="building.building_id">
                    {{ building.name }}
                </option>
            </select>
        </div>

        <div class="sidebar-menu">
            <div class="menu-group">
                <h6 class="text-uppercase text-white-50">Tổng quan</h6>
                <div class="nav flex-column">
                    <li>
                        <NuxtLink :class="getActiveClass('/dashboard')" class="nav-link text-white py-2"
                            to="/dashboard">
                            <span><Icon name="mdi:view-dashboard" size="24"/></span>Dashboard
                        </NuxtLink>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/building')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/building')"><span><Icon name="mdi:building" size="24"/></span>Tòa nhà</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/stars')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/stars')"><span><Icon name="material-symbols:overview" size="24"/></span>Thống kê</a>
                    </li>
                </div>
            </div>

            <div class="menu-group">
                <h6 class="text-uppercase text-white-50">Quản lý</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/apartment')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/apartment')"><span><Icon name="ion:home" size="24"/></span>Căn hộ</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/resident')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/resident')"><span><Icon name="ic:baseline-people" size="24"/></span>Cư dân</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/invoice')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/invoice')"><span><Icon name="fa6-solid:file-invoice-dollar" size="24"/></span>Quản lý phí</a>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification'

const dashboardStore = useDashboardStore();
const route = useRoute();
const toast = useToast()

const getActiveClass = (path) => {
    return route.path.startsWith(path) ? 'active' : '';
};

// Sử dụng `computed` để đồng bộ giá trị với store
const selectedBuilding = computed({
    get: () => dashboardStore.getSelectedBuildingId,
    set: (value) => dashboardStore.setSelectedBuilding(value),
});

const handleBuildingChange = async () => {
    try {
        if (selectedBuilding.value === 'all') {
            await dashboardStore.fetchStatsBuildings()
            navigateTo('dashboard')
        } else {
            await dashboardStore.fetchStatsBuilding(selectedBuilding.value)
            navigateTo('dashboard')
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu dashboard:', error)
    }
    return selectedBuilding.value
}

const checkBuildingAndNavigate = (route) => {
    if (selectedBuilding.value == 'all') {
        toast.warning('Vui lòng chọn tòa nhà!')
    }
    else {
        navigateTo(route)
    }
}

onMounted(async () => {
    await dashboardStore.fetchStatsBuildings();
});
</script>

<style scoped>
/* Sidebar chính */
.sidebar {
    width: 300px;
    min-height: 100vh;
    height: auto;
    background: #4361ee;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow-y: auto;
    scrollbar-width: thin;
}

/* Header */
.sidebar-header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 0;
    margin: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Dropdown */
.sidebar-select {
    padding: 10px 5px 20px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Menu */
.sidebar-menu {
    flex-grow: 1;
    padding: 0 10px;
}

.menu-group {
    margin: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-title {
    font-size: 12px;
    font-weight: bold;
    opacity: 0.8;
    margin: 10px 0 5px;
    text-transform: uppercase;
}

ul {
    list-style: none;
    padding: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 8px;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: 0.3s;
}

.menu-item input {
    margin-right: 5px;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.2);
}

.active .menu-item {
    background: rgba(0, 0, 0, 0.3);
    font-weight: bold;
}

/* Scrollbar */
.sidebar::-webkit-scrollbar {
    width: 5px;
}

.sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
}

.nav-link {
    transition: background-color 0.3s, color 0.3s;
    border-radius: 4px;
    display: flex;
    align-items: center;
}

.nav-link span{
    padding: 5px 5px 0 0;
}

.nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: bold;
    color: #fff !important;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>