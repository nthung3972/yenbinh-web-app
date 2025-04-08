<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
            <h2 class="logo">YB-Manager</h2>
        </div>

        <!-- Dropdown chọn tòa nhà -->
        <div class="sidebar-select">
            <select v-model="selectedBuilding" @change="handleBuildingChange()" class="form-select">
                <option value="all">--- Tất cả tòa nhà ---</option>
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
                            <span>
                                <Icon name="mdi:view-dashboard" size="24" />
                            </span>Dashboard
                        </NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/building')" class="nav-link text-white py-2" to="/building">
                            <span>
                                <Icon name="mdi:building" size="24" />
                            </span>Tòa nhà
                        </NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/staff')" class="nav-link text-white py-2" to="/staff">
                            <span>
                                <Icon name="guidance:care-staff-area" size="24" />
                            </span>Nhân viên
                        </NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/admin-report')" class="nav-link text-white py-2"
                            to="/admin-report/daily-report">
                            <span>
                                <Icon name="material-symbols:report" size="24" />
                            </span>Báo cáo nhân sự
                        </NuxtLink>
                    </li>
                    <!-- Thống kê với Submenu -->
                    <li v-if="authStore.isAdmin">
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/statistical')"
                            @click.prevent="isStatisticalOpen = !isStatisticalOpen">
                            <span>
                                <Icon name="material-symbols:overview" size="24" /> Thống kê
                            </span>
                            <Icon :name="isStatisticalOpenComputed ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                                size="20" />
                        </a>
                        <ul v-show="isStatisticalOpenComputed" class="submenu">
                            <li>
                                <NuxtLink :class="getActiveClass('/statistical/overview')"
                                    class="nav-link text-white py-2" to="/statistical/overview">
                                    <Icon name="mdi:chart-bar" size="20" /> Tổng quan
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink :class="getActiveClass('/statistical/finance')"
                                    class="nav-link text-white py-2" to="/statistical/finance">
                                    <Icon name="mdi:currency-usd" size="20" /> Tài chính
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink :class="getActiveClass('/statistical/parking')"
                                    class="nav-link text-white py-2" to="/statistical/parking">
                                    <Icon name="mdi:car" size="20" /> Bãi đỗ xe
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                </div>
            </div>

            <div class="menu-group">
                <h6 class="text-uppercase text-white-50">Tòa nhà</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/apartment')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/apartment')"><span>
                                <Icon name="ion:home" size="24" />
                            </span>Căn hộ</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/resident')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/resident')"><span>
                                <Icon name="ic:baseline-people" size="24" />
                            </span>Cư dân</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/invoice')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/invoice')"><span>
                                <Icon name="fa6-solid:file-invoice-dollar" size="24" />
                            </span>Quản lý phí</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/vehicle')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/vehicle')"><span>
                                <Icon name="fluent:vehicle-cab-20-filled" size="24" />
                            </span>Quản lý xe</a>
                    </li>
                </div>
            </div>

            <div class="menu-group">
                <h6 class="text-uppercase text-white-50">Dịch vụ</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/service')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/service')"><span>
                                <Icon name="lsicon:service-filled" size="24" />
                            </span>Dịch vụ</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/fix')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/fix')"><span>
                                <Icon name="fluent-mdl2:service-off" size="24" />
                            </span>Sửa chữa</a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/ads')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/ads')"><span>
                                <Icon name="ri:advertisement-fill" size="24" />
                            </span>Quảng cáo</a>
                    </li>
                </div>
            </div>

            <div class="menu-group" v-if="authStore.isStaff">
                <h6 class="text-uppercase text-white-50">Báo cáo</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/report')" class="nav-link text-white py-2"
                            @click.prevent="checkBuildingAndNavigate('/report/daily-report')"><span>
                                <Icon name="material-symbols:report" size="24" />
                            </span>Nhân sự hàng ngày</a>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

const dashboardStore = useDashboardStore()
const route = useRoute()
const toast = useToast()
const isStatisticalOpen = ref(false)
const authStore = useAuthStore()

const getActiveClass = (path) => {
    return route.path.startsWith(path) ? 'active' : '';
};

const isStatisticalOpenComputed = computed(() => {
    return isStatisticalOpen.value || route.path.startsWith('/statistical');
});

// Sử dụng `computed` để đồng bộ giá trị với store
const selectedBuilding = computed({
    get: () => dashboardStore.getSelectedBuildingId,
    set: (value) => dashboardStore.setSelectedBuilding(value),
});

const handleBuildingChange = async () => {
    try {
        if (selectedBuilding.value === 'all') {
            await dashboardStore.fetchStatsBuildings()
            navigateTo('/dashboard')
        } else {
            await dashboardStore.fetchStatsBuilding(selectedBuilding.value)
            navigateTo('/dashboard')
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

.nav-link span {
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

.submenu {
    list-style: none;
    padding-left: 20px;
    transition: all 0.3s ease-in-out;
}

.submenu li {
    padding: 5px 0;
}
</style>