<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header d-flex align-items-center gap-2 p-3">
            <img :src="defaultAvatar" class="rounded-circle" width="40" height="40" alt="Avatar" />
            <h2 class="h5 mb-0">YB-MANAGEMENT</h2>
        </div>

        <!-- Dropdown chọn tòa nhà -->
        <div class="sidebar-select">
            <select v-model="localSelectedBuilding" class="form-select">
                <option value="all">—— Tất cả tòa nhà ——</option>
                <option v-for="building in buildings" :key="building.building_id" :value="building.building_id">
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
                            <span class="menu-icon">
                                <Icon name="mdi:view-dashboard" size="22" />
                            </span>
                            <span class="menu-text">Dashboard</span>
                        </NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/building')" class="nav-link text-white py-2" to="/building">
                            <span class="menu-icon">
                                <Icon name="mdi:building" size="22" />
                            </span>
                            <span class="menu-text">Tòa nhà</span>
                        </NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/staff')" class="nav-link text-white py-2" to="/staff">
                            <span class="menu-icon">
                                <Icon name="guidance:care-staff-area" size="22" />
                            </span>
                            <span class="menu-text">Nhân viên</span>
                        </NuxtLink>
                    </li>

                    <!-- Submenu Báo cáo nhân sự -->
                    <li v-if="authStore.isAdmin">
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/admin-report')" @click.prevent="isReportOpen = !isReportOpen">
                            <div class="d-flex align-items-center">
                                <span class="menu-icon">
                                    <Icon name="material-symbols:report" size="22" />
                                </span>
                                <span class="menu-text">Báo cáo nhân sự</span>
                            </div>
                            <span class="submenu-arrow">
                                <Icon :name="isReportOpenComputed ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                                    size="18" />
                            </span>
                        </a>
                        <transition name="slide">
                            <ul v-show="isReportOpenComputed" class="submenu">
                                <li>
                                    <NuxtLink :class="getActiveClass('/admin-report/daily-report')"
                                        class="nav-link text-white py-2" to="/admin-report/daily-report">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:calendar-check" size="18" />
                                        </span>
                                        <span>Báo cáo hàng ngày</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </transition>
                    </li>

                    <!-- Submenu Thống kê -->
                    <li>
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/statistical')"
                            @click.prevent="isStatisticalOpen = !isStatisticalOpen">
                            <div class="d-flex align-items-center">
                                <span class="menu-icon">
                                    <Icon name="material-symbols:overview" size="22" />
                                </span>
                                <span class="menu-text">Thống kê</span>
                            </div>
                            <span class="submenu-arrow">
                                <Icon :name="isStatisticalOpenComputed ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                                    size="18" />
                            </span>
                        </a>
                        <transition name="slide">
                            <ul v-show="isStatisticalOpenComputed" class="submenu">
                                <li>
                                    <NuxtLink :class="getActiveClass('/statistical/finance')"
                                        class="nav-link text-white py-2" to="/statistical/finance">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:currency-usd" size="18" />
                                        </span>
                                        <span>Tài chính</span>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :class="getActiveClass('/statistical/overview')"
                                        class="nav-link text-white py-2" to="/statistical/overview">
                                        <span class="submenu-icon">
                                            <Icon name="ion:home" size="18" />
                                        </span>
                                        <span>Căn hộ</span>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :class="getActiveClass('/statistical/parking')"
                                        class="nav-link text-white py-2" to="/statistical/parking">
                                        <span class="submenu-icon">
                                            <Icon name="fluent:vehicle-cab-20-filled" size="18" />
                                        </span>
                                        <span>Phương tiện</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </transition>
                    </li>
                </div>
            </div>

            <div class="menu-group">
                <h6 class="text-uppercase text-white-50">Tòa nhà</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/apartment')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/apartment')">
                            <span class="menu-icon">
                                <Icon name="ion:home" size="22" />
                            </span>
                            <span class="menu-text">Căn hộ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/resident')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/resident')">
                            <span class="menu-icon">
                                <Icon name="ic:baseline-people" size="22" />
                            </span>
                            <span class="menu-text">Cư dân</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/invoice')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/invoice')">
                            <span class="menu-icon">
                                <Icon name="fa6-solid:file-invoice-dollar" size="22" />
                            </span>
                            <span class="menu-text">Quản lý phí</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/vehicle')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/vehicle')">
                            <span class="menu-icon">
                                <Icon name="fluent:vehicle-cab-20-filled" size="22" />
                            </span>
                            <span class="menu-text">Quản lý xe</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/personnel-building')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/personnel-building')">
                            <span class="menu-icon">
                                <Icon name="icon-park-outline:file-staff-one" size="22" />
                            </span>
                            <span class="menu-text">Quản lý nhân sự</span>
                        </a>
                    </li>
                </div>
            </div>

            <div class="menu-group" v-if="authStore.isStaff">
                <h6 class="text-uppercase text-white-50">Báo cáo</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/report')" @click.prevent="isStaffReportOpen = !isStaffReportOpen">
                            <div class="d-flex align-items-center">
                                <span class="menu-icon">
                                    <Icon name="material-symbols:report" size="22" />
                                </span>
                                <span class="menu-text">Báo cáo</span>
                            </div>
                            <span class="submenu-arrow">
                                <Icon :name="isStaffReportOpenComputed ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                                    size="18" />
                            </span>
                        </a>
                        <transition name="slide">
                            <ul v-show="isStaffReportOpenComputed" class="submenu">
                                <li>
                                    <a href="#" :class="getActiveClass('/report/daily-report')"
                                        class="nav-link text-white py-2"
                                        @click.prevent="$emit('check-building-and-navigate', '/report/daily-report')">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:calendar-today" size="18" />
                                        </span>
                                        <span>Báo cáo hàng ngày</span>
                                    </a>
                                </li>
                                <!-- <li>
                                    <a href="#" :class="getActiveClass('/report/shifts')"
                                        class="nav-link text-white py-2"
                                        @click.prevent="$emit('check-building-and-navigate', '/report/shifts')">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:clock-time-eight" size="18" />
                                        </span>
                                        <span>Lịch ca làm việc</span>
                                    </a>
                                </li> -->
                                <!-- <li>
                                    <a href="#" :class="getActiveClass('/report/timesheet')"
                                        class="nav-link text-white py-2"
                                        @click.prevent="$emit('check-building-and-navigate', '/report/timesheet')">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:calendar-clock" size="18" />
                                        </span>
                                        <span>Bảng chấm công</span>
                                    </a>
                                </li> -->
                            </ul>
                        </transition>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import defaultAvatar from '@/assets/images/logo-yenbinh.png'

const props = defineProps({
    buildings: Array,
    selectedBuildingId: String,
});

const emit = defineEmits(['building-change', 'check-building-and-navigate']);

const route = useRoute();
const authStore = useAuthStore();
const isStatisticalOpen = ref(false);
const isReportOpen = ref(false);
const isStaffReportOpen = ref(false);

const localSelectedBuilding = computed({
    get: () => props.selectedBuildingId,
    set: (value) => emit('building-change', value),
});

const getActiveClass = (path) => {
    return route.path.startsWith(path) ? 'active' : '';
};

const isStatisticalOpenComputed = computed(() => {
    return isStatisticalOpen.value || route.path.startsWith('/statistical');
});

const isReportOpenComputed = computed(() => {
    return isReportOpen.value || route.path.startsWith('/admin-report');
});

const isStaffReportOpenComputed = computed(() => {
    return isStaffReportOpen.value || route.path.startsWith('/report');
});
</script>

<style scoped>
.sidebar {
    width: 300px;
    height: 100vh;
    background: linear-gradient(135deg, #4361ee, #3a56d4);
    color: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow-y: auto;
    scrollbar-width: thin;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* Header */
.sidebar-header {
    display: flex;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 15px 0;
    margin: 0 0 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.logo {
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.5px;
}

/* Dropdown */
.sidebar-select {
    padding: 10px 5px 20px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.form-select {
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #000;
    font-size: 14px;
    border-radius: 6px;
}

.form-select option {
    background-color: white;
    color: #000;
}

/* Menu */
.sidebar-menu {
    flex-grow: 1;
    padding: 0 5px;
    margin-top: 10px;
}

.menu-group {
    margin: 0 0 20px 0;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.menu-group h6 {
    font-size: 12px;
    margin: 10px 0 12px 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.nav {
    list-style: none;
    padding: 0;
}

/* Menu items */
.nav-link {
    transition: all 0.2s ease-in-out;
    border-radius: 6px;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 14px;
    padding: 10px 12px !important;
    margin: 2px 0;
}

.menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    width: 24px;
    height: 24px;
}

.menu-text {
    flex-grow: 1;
}

.nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 500;
    color: #fff !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateX(2px);
}

/* Submenu */
.submenu {
    list-style: none;
    padding-left: 35px;
    margin: 2px 0;
}

.submenu-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.submenu li {
    margin: 3px 0;
}

.submenu .nav-link {
    padding: 8px 12px !important;
    font-size: 13px;
}

.submenu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    opacity: 0.9;
}

/* Animation for submenu */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease-out;
    max-height: 300px;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}

/* Scrollbar */
.sidebar::-webkit-scrollbar {
    width: 4px;
}

.sidebar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>
