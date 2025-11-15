<template>
    <div class="d-flex flex-column h-100">
        <!-- Header -->
        <div
            class="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom border-light">
            <div class="d-flex align-items-center gap-2">
                <img src="@/assets/images/logo-yenbinh.png" class="rounded-circle" width="40" height="40" alt="Logo" />
                <transition name="slide-fade" mode="out-in">
                    <div v-if="isExpanded || isAsideOpen" key="text" class="ms-2 text-white">
                        <div class="fw-semibold fs-6 lh-1">YB-MANAGEMENT</div>
                        <div class="small text-white-50 mt-1">Quản lý vận hành chuyên nghiệp</div>
                    </div>
                </transition>
            </div>

            <!-- Nút thu gọn -->
            <button v-if="isExpanded" class="btn-collapse-aside d-none d-lg-flex" @click="$emit('collapse-desktop')"
                title="Thu gọn Menu">
                <i class="bi bi-chevron-left"></i>
            </button>
        </div>

        <!-- Select Building -->
        <div v-show="isExpanded || isAsideOpen" class="px-3 py-3  border-bottom">
            <select v-model="localSelectedBuilding" class="form-select form-select-sm">
                <option value="all">—— Tất cả tòa nhà ——</option>
                <option v-for="b in buildings" :key="b.building_id" :value="b.building_id">{{ b.name }}</option>
            </select>
        </div>

        <!-- Menu -->
        <div class="sidebar-menu flex-grow-1 overflow-auto py-3 px-2">
            <!-- Copy nguyên menu -->
            <div class="menu-group">
                <h6 v-if="isExpanded || isAsideOpen" class="text-uppercase text-white-50">Tổng quan</h6>
                <div class="nav flex-column">
                    <li>
                        <NuxtLink :class="getActiveClass('/dashboard')" class="nav-link text-white py-2"
                            to="/dashboard">
                            <span class="menu-icon">
                                <Icon name="mdi:view-dashboard" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Dashboard</span>
                        </NuxtLink>
                    </li>

                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/building')" class="nav-link text-white py-2" to="/building">
                            <span class="menu-icon">
                                <Icon name="mdi:building" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Tòa nhà</span>
                        </NuxtLink>
                    </li>

                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/staff')" class="nav-link text-white py-2" to="/staff">
                            <span class="menu-icon">
                                <Icon name="guidance:care-staff-area" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Nhân viên</span>
                        </NuxtLink>
                    </li>

                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/shift')" class="nav-link text-white py-2" to="/shift">
                            <span class="menu-icon">
                                <Icon name="ix:shift-filled" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Ca làm việc</span>
                        </NuxtLink>
                    </li>

                    <li v-if="authStore.isAdmin">
                        <NuxtLink :class="getActiveClass('/fee-type')" class="nav-link text-white py-2" to="/fee-type">
                            <span class="menu-icon">
                                <Icon name="cib:cashapp" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Loại phí</span>
                        </NuxtLink>
                    </li>

                    <!-- Báo cáo nhân sự -->
                    <li v-if="authStore.isAdmin">
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/admin-report')" @click.prevent="isReportOpen = !isReportOpen">
                            <div class="d-flex align-items-center gap-2">
                                <span class="menu-icon">
                                    <Icon name="material-symbols:report" size="22" />
                                </span>
                                <span v-if="isExpanded || isAsideOpen" class="menu-text">Báo cáo</span>
                            </div>
                            <Icon v-if="isExpanded || isAsideOpen" :name="isReportOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" size="18" />
                        </a>
                        <transition name="slide">
                            <ul v-show="isReportOpen" class="submenu">
                                <li>
                                    <NuxtLink :class="getActiveClass('/admin-report/daily-report')"
                                        class="nav-link text-white py-2" to="/admin-report/daily-report">
                                        <span class="submenu-icon">
                                            <Icon name="mdi:calendar-check" size="18" />
                                        </span>
                                        <span>Kế hoạch nhân sự</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </transition>
                    </li>

                    <!-- Thống kê -->
                    <li>
                        <a href="#" class="nav-link text-white py-2 d-flex justify-content-between align-items-center"
                            :class="getActiveClass('/statistical')"
                            @click.prevent="isStatisticalOpen = !isStatisticalOpen">
                            <div class="d-flex align-items-center gap-2">
                                <span class="menu-icon">
                                    <Icon name="material-symbols:overview" size="22" />
                                </span>
                                <span v-if="isExpanded || isAsideOpen" class="menu-text">Thống kê</span>
                            </div>
                            <Icon v-if="isExpanded || isAsideOpen" :name="isStatisticalOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" size="18" />
                        </a>
                        <transition name="slide">
                            <ul v-show="isStatisticalOpen" class="submenu">
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
                <h6 v-if="isExpanded || isAsideOpen" class="text-uppercase text-white-50">Tòa nhà</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/apartment')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/apartment')">
                            <Icon name="ion:home" size="22" class="me-2" /> 
                            <span v-if="isExpanded || isAsideOpen" class="menu-text"> Căn hộ</span> 
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/resident')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/resident')">
                            <Icon name="ic:baseline-people" size="22" class="me-2" /> 
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Cư dân</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/building-fee')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/building-fee')">
                            <Icon name="mdi:cash-multiple" size="22" class="me-2" /> 
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Biểu phí</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/utilities')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/utilities')">
                            <Icon name="mdi:meter-electric" size="22" class="me-2" /> 
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Điện nước</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/invoice')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/invoice')">
                            <Icon name="fa6-solid:file-invoice-dollar" size="22" class="me-2" />
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Hóa đơn</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/vehicle')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/vehicle')">
                            <span class="menu-icon">
                                <Icon name="fluent:vehicle-cab-20-filled" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Phương tiện</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/personnel-building')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/personnel-building')">
                            <span class="menu-icon">
                                <Icon name="icon-park-outline:file-staff-one" size="22" />
                            </span>
                            <span v-if="isExpanded || isAsideOpen" class="menu-text">Nhân sự</span>
                        </a>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
    buildings: Array,
    selectedBuildingId: String,
    isExpanded: Boolean,
    isAsideOpen: Boolean,
})

const emit = defineEmits(['building-change', 'check-building-and-navigate', 'collapse-desktop'])
const authStore = useAuthStore()
const route = useRoute();

const localSelectedBuilding = computed({
    get: () => props.selectedBuildingId,
    set: (v) => emit('building-change', v),
})

const isReportOpen = ref(false)
const isStatisticalOpen = ref(false)

const getActiveClass = (path) => {
    return route.path === path || route.path.startsWith(path + '/') ? 'active' : '';
};
</script>

<style scoped>
/* Hiệu ứng submenu */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

.sidebar-header {
    height: 80px;
}

/* Menu tổng thể */
.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    /* khoảng cách giữa các menu-group */
    padding-bottom: 1rem;
}

/* Nhóm menu */
.menu-group {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    /* gạch phân cách nhẹ */
}

.menu-group:last-child {
    border-bottom: none;
    /* bỏ gạch ở nhóm cuối cùng */
}

/* Tiêu đề nhóm */
.menu-group h6 {
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
}

/* Các item menu */
.nav {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    /* khoảng cách giữa các item trong 1 nhóm */
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.85);
    transition: all 0.25s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.12);
    color: #fff;
}

/* Menu đang active */
.nav-link.active {
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #fff;
}

/* Icon */
.menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
}

/* Submenu */
.submenu {
    list-style: none;
    padding-left: 1.75rem;
    margin-top: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.submenu .nav-link {
    font-size: 0.875rem;
    opacity: 0.9;
}

.submenu .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.btn-collapse-aside {
    background-color: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 6px;
    padding: 2px 10px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    position: absolute;
    top: 8px;
    right: 8px;
}

.btn-collapse-aside:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-1px);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.6) !important;
}

.small {
  font-size: 0.75rem;
  letter-spacing: 0.3px;
}
</style>
