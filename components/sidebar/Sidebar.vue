<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="sidebar-header">
            <h2 class="logo">YB-Manager</h2>
        </div>

        <!-- Dropdown chọn tòa nhà -->
        <div class="sidebar-select">
            <select v-model="localSelectedBuilding" @change="emitBuildingChange" class="form-select">
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
                            @click.prevent="$emit('check-building-and-navigate', '/apartment')">
                            <span>
                                <Icon name="ion:home" size="24" />
                            </span>Căn hộ
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/resident')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/resident')">
                            <span>
                                <Icon name="ic:baseline-people" size="24" />
                            </span>Cư dân
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/invoice')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/invoice')">
                            <span>
                                <Icon name="fa6-solid:file-invoice-dollar" size="24" />
                            </span>Quản lý phí
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="getActiveClass('/vehicle')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/vehicle')">
                            <span>
                                <Icon name="fluent:vehicle-cab-20-filled" size="24" />
                            </span>Quản lý xe
                        </a>
                    </li>
                </div>
            </div>

            <div class="menu-group" v-if="authStore.isStaff">
                <h6 class="text-uppercase text-white-50">Báo cáo</h6>
                <div class="nav flex-column">
                    <li>
                        <a href="#" :class="getActiveClass('/report')" class="nav-link text-white py-2"
                            @click.prevent="$emit('check-building-and-navigate', '/report/daily-report')">
                            <span>
                                <Icon name="material-symbols:report" size="24" />
                            </span>Nhân sự hàng ngày
                        </a>
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

// Định nghĩa props
const props = defineProps({
  buildings: Array,
  selectedBuildingId: String,
});

// Định nghĩa emits
const emit = defineEmits(['building-change', 'check-building-and-navigate']);

const route = useRoute();
const authStore = useAuthStore();
const isStatisticalOpen = ref(false);

// Sửa localSelectedBuilding để sử dụng props trực tiếp
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

const emitBuildingChange = () => {
  emit('building-change', localSelectedBuilding.value);
};
</script>

<style scoped>
/* Giữ nguyên CSS từ mã gốc */
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
/* Các style khác giữ nguyên */
</style>
