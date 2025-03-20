<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
            <h2 class="logo">BuildingManager</h2>
        </div>

        <!-- Dropdown chọn tòa nhà -->
        <div class="sidebar-select">
            <select v-model="selectedBuilding" class="form-select">
                <option value="all">Tất cả tòa nhà</option>
                <option v-for="building in buildings" :key="building.id" :value="building.id">
                    {{ building.name }}
                </option>
            </select>
        </div>

        <!-- Menu -->
        <div class="sidebar-menu">
            <div v-for="group in menuGroups" :key="group.title">
                <h6 class="menu-title">{{ group.title }}</h6>
                <ul>
                    <li v-for="item in group.items" :key="item.name" :class="{ active: isActive(item.path) }">
                        <NuxtLink :to="item.path" class="menu-item">
                            <input type="checkbox" v-if="item.checkbox" />
                            {{ item.name }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Danh sách tòa nhà
const buildings = ref([
    { id: 1, name: 'Landmark 81' },
    { id: 2, name: 'Vincom Center' },
    { id: 3, name: 'Times City' },
])

const selectedBuilding = ref('all')

// Nhóm menu
const menuGroups = ref([
    {
        title: 'TỔNG QUAN',
        items: [
            { name: 'Dashboard', path: '/', checkbox: true },
            { name: 'Tòa nhà', path: '/buildings', checkbox: true },
            { name: 'Báo cáo', path: '/reports', checkbox: true },
        ],
    },
    {
        title: 'QUẢN LÝ',
        items: [
            { name: 'Cư dân', path: '/residents', checkbox: true },
            { name: 'Căn hộ', path: '/apartments', checkbox: true },
            { name: 'Quản lý phí', path: '/fees', checkbox: true },
            { name: 'Bảo trì', path: '/maintenance', checkbox: true },
            { name: 'Khiếu nại', path: '/complaints', checkbox: true },
        ],
    },
    {
        title: 'DỊCH VỤ',
        items: [
            { name: 'Dịch vụ', path: '/services', checkbox: true },
            { name: 'Bãi đỗ xe', path: '/parking', checkbox: true },
            { name: 'Tiện ích công cộng', path: '/facilities', checkbox: true },
        ],
    },
    {
        title: 'HỆ THỐNG',
        items: [],
    },
])

// Kiểm tra đường dẫn hiện tại
const isActive = (path) => route.path === path
</script>

<style scoped>
/* Sidebar chính */
.sidebar {
    width: 300px;
    height: 100vh;
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
</style>