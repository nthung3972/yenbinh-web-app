<template>
    <nav class="navbar navbar-light px-4">
        <div class="header-title">
            <h1>{{ userInfo?.name ?? '' }}</h1>
            <p>Quyền truy cập: {{ userInfo?.role === 'admin' ? 'Quản lý' : 'Nhân viên' }}</p>
        </div>
        <div class="navbar-actions d-flex align-items-center gap-3">
            <!-- Icon thông báo -->
            <button class="notification-btn position-relative" @click="handleNotificationClick" title="Thông báo">
                <Icon name="bx:bell" :size="28" />
                <!-- Badge hiển thị số lượng thông báo -->
                <span v-if="notificationCount > 0" class="notification-badge">
                    {{ notificationCount > 99 ? '99+' : notificationCount }}
                </span>
            </button>
            <!-- UserAvatarDropdown -->
            <UserAvatarDropdown :avatar="userInfo?.avatar" :username="userInfo?.name" :email="userInfo?.email"
                @menu-item-click="handleMenuAction" />
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuthService from '~/services/auth.service';
import UserAvatarDropdown from '~/components/header/UserAvatarDropdown.vue';
import { useLoadingStore } from '@/stores/loading';
// import { resetAllStores } from '@/stores';

const props = defineProps({
    userInfo: Object,
});

const router = useRouter();
const loadingStore = useLoadingStore();

// Trạng thái thông báo
const notificationCount = ref(3) // Ví dụ: 3 thông báo mới, thay bằng dữ liệu thực tế
const isNotificationOpen = ref(false)

// Xử lý click vào icon thông báo
const handleNotificationClick = () => {
  isNotificationOpen.value = !isNotificationOpen.value
  // Logic mở danh sách thông báo, ví dụ: hiển thị modal hoặc dropdown
  console.log('Notification clicked, open:', isNotificationOpen.value)
}

const handleMenuAction = (action) => {
    switch (action) {
        case 'profile':
            router.push('/profile');
            break;
        case 'change-password':
            router.push('/auth/change-password');
            break;
        case 'logout':
            logout();
            break;
    }
};

const logout = async () => {
    try {
        loadingStore.showLoading();
        await AuthService.logout();
        resetAllStores();
        await router.push('/auth/login');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        loadingStore.hideLoading();
    }
};
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 20px;
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-title h1 {
    margin: 0;
    font-size: 28px;
    color: var(--dark);
    font-weight: bold;
}

.header-title p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.user-info {
    position: relative;
    display: flex;
    align-items: center;
}

.info {
    position: relative;
    cursor: pointer;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 50%;
    text-align: center;
    width: 40px;
    height: 40px;
}

.dropdown-menu {
    position: absolute;
    top: 50px;
    right: 0;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    min-width: 200px;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

[v-show="false"] {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
}

[v-show="true"] {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-menu ul {
    list-style: none;
    padding: 10px;
    margin: 0;
}

.dropdown-menu li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
}

.dropdown-menu li:hover {
    background: #f0f0f0;
}

/* .info:hover .dropdown-menu {
    display: block;
} */

.search-box {
    background-color: var(--light);
    border-radius: 20px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    padding: 5px;
    width: 300px;
}

/* Notification button */
.notification-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  color: #4b5563;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}
.notification-btn:hover {
  color: #2563eb;
  transform: scale(1.1);
}
.notification-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Notification badge */
.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background-color: #ef4444; /* Màu đỏ cho badge */
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
  padding: 0 4px;
}
</style>
