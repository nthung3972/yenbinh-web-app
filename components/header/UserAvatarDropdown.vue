<template>
    <div class="avatar-dropdown-container">
        <!-- Avatar button -->
        <div @click="toggleMenu" class="cursor-pointer rounded-full overflow-hidden">
            <img :src="avatarSrc"
                class="w-10 h-10 object-cover" />
        </div>

        <!-- Dropdown menu -->
        <div v-if="isMenuOpen" class="menu" :class="{ active: isMenuOpen }">
            <div class="email">
                <p>{{ email || 'user@example.com' }}</p>
            </div>

            <ul class="item">
                <li style="" v-for="(item, index) in menuItems" :key="index" @click="handleItemClick(item)"
                    class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center">
                    <span v-if="item.icon" class="mr-2">{{ item.icon }}</span>
                    {{ item.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import defaultAvatar from '@/assets/images/avatar-default.jpg'

// Props
const props = defineProps({
    avatar: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    }
})

const avatarSrc = computed(() => props.avatar || defaultAvatar)

// Emit events
const emit = defineEmits(['menu-item-click'])

// Data
const isMenuOpen = ref(false)
const menuItems = ref([
    { label: 'Thông tin cá nhân', action: 'profile', icon: '👤' },
    { label: 'Đổi mật khẩu', action: 'change-password', icon: '🔑' },
    { label: 'Cài đặt', action: 'settings', icon: '⚙️' },
    { label: 'Đăng xuất', action: 'logout', icon: '🚪' }
])

// Methods
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const handleItemClick = (item) => {
    emit('menu-item-click', item.action)
    isMenuOpen.value = false
}

const handleClickOutside = (event) => {
    const el = event.target
    if (isMenuOpen.value && !event.target.closest('.avatar-dropdown-container')) {
        isMenuOpen.value = false
    }
}

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.avatar-dropdown-container {
    position: relative;
    display: inline-block;
}

.menu {
    position: absolute;
    z-index: 1;
    right: 0;
    background-color: white;
    min-width: 180px;
    top: calc(100% + 15px);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.menu.active {
    transform: scale(1.1);
}

.email p{
    text-align: center;
    margin: 10px;
    font-size: 13px;
}

.item {
    list-style: none;
    padding: 0;
    margin: 0;
}

.item li {
    padding: 10px;
    font-size: 13px;
    cursor: pointer;
}

.item li:hover {
    background: rgba(80, 75, 75, 0.2);
}

img {
    width: 40px;
    height: 40px;
    border-radius: 50px;
}

</style>