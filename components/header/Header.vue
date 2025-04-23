<template>
    <nav class="navbar navbar-light px-4">
        <div class="header-title">
            <h1>{{ userInfo?.name ?? '' }}</h1>
            <p>Quyền truy cập: {{ userInfo?.role === 'admin' ? 'Quản lý' : 'Nhân viên' }}</p>
        </div>
        <UserAvatarDropdown :avatar="userInfo?.avatar" :username="userInfo?.name" :email="userInfo?.email"
            @menu-item-click="handleMenuAction" />
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
        await router.push('/login');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        loadingStore.hideLoading();
    }
};
</script>