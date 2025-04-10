<template>
    <nav class="navbar navbar-light px-4">
        <div class="header-title">
            <h1>{{ name ?? '' }}</h1>
            <p>Quyền truy cập: {{ role === 'admin' ? 'Quản lý' : 'Nhân viên'}}</p>
        </div>

        <UserAvatarDropdown :avatar="userStore.avatar" :username="name" :email="email"
                @menu-item-click="handleMenuAction" />
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AuthService from '~/services/auth.service'
import UserAvatarDropdown from '~/components/header/UserAvatarDropdown.vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore();

const name = ref('')
const email = ref('')
const role = ref('')

const handleMenuAction = (action) => {
  switch (action) {
    case 'profile':
      navigateTo('/profile')
      break

    case 'change-password':
      navigateTo('/auth/change-password')
      break
      
    case 'logout':
      logout()
      break
  }
}

const logout = async () => {
    try {
        await AuthService.logout();
        resetAllStores()
    } catch (error) {
        console.error('Logout error:', error);
    }
}

const loadUserInfo = async () => {
    try {
        const result = await userStore.getUserInfo()
        if(result) {
            name.value = result.user.name
            email.value = result.user.email
            role.value = result.user.role
        }
    }catch (error) {
        console.error('Lỗi tải sữ liệu:', error);
    }
}

onMounted(() => {
    loadUserInfo()
});
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
</style>
