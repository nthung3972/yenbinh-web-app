<template>
    <div class="avatar-dropdown-container">
        <!-- Avatar button -->
        <div @click.stop="toggleMenu" class="avatar-trigger" :class="{ 'avatar-active': isMenuOpen }">
            <img :src="props.avatar || defaultAvatar" :alt="props.username || 'User'" class="avatar-image" />
            <div class="avatar-status"></div>
        </div>

        <!-- Dropdown menu -->
        <div v-if="isMenuOpen" class="menu" :class="{ active: isMenuOpen }">
            <!-- User Info Section -->
            <div class="user-info">
                <div class="user-avatar-large">
                    <img :src="props.avatar || defaultAvatar" :alt="props.username || 'User'" />
                </div>
                <div class="user-details">
                    <p class="user-name">{{ props.username || 'User Name' }}</p>
                    <p class="user-email">{{ props.email || 'user@example.com' }}</p>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Menu Items -->
            <ul class="menu-list">
                <li v-for="(item, index) in menuItems" :key="index" @click="handleItemClick(item)" class="menu-item"
                    :class="{ 'menu-item-danger': item.danger }">
                    <span class="menu-icon" v-html="item.icon"></span>
                    <span class="menu-label">{{ item.label }}</span>
                    <svg v-if="!item.danger" class="menu-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
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

// Emit events
const emit = defineEmits(['menu-item-click'])

// Data
const isMenuOpen = ref(false)
const menuItems = ref([
    { label: 'Tài khoản', action: 'profile', icon: '👤' },
    { label: 'Đổi mật khẩu', action: 'change-password', icon: '🔑' },
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
/* Container */
.avatar-dropdown-container {
  position: relative;
  display: inline-block;
  z-index: 100; /* ← Thêm z-index */
}

.menu {
    position: absolute;
    z-index: 1000;
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

/* Avatar Trigger */
.avatar-trigger {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-trigger:hover {
  transform: scale(1.05);
}

.avatar-trigger.avatar-active {
  transform: scale(1.05);
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s ease;
}

.avatar-trigger:hover .avatar-image {
  border-color: #3b82f6;
}

/* Online status dot */
.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
}

/* Dropdown Menu */
.dropdown-menu {
    position: absolute;
    z-index: 1000;
    right: 0;
    background-color: white;
    min-width: 180px;
    top: calc(100% + 15px);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;


    /* position: absolute;
    top: calc(100% + 12px);
    right: 0;
    min-width: 280px;
    background: white;
    border-radius: 12px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    z-index: 9999; */
}

/* User Info Section */
.user-info {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Divider */
.divider {
  height: 1px;
  background: #e5e7eb;
}

/* Menu List */
.menu-list {
  list-style: none;
  padding: 8px;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-item-danger {
  color: #ef4444;
}

.menu-item-danger:hover {
  background: #fef2f2;
  color: #dc2626;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: currentColor;
}

.menu-label {
  flex: 1;
}

.menu-arrow {
  flex-shrink: 0;
  color: #9ca3af;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.menu-item:hover .menu-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Dropdown Animation */
.dropdown-enter-active {
  animation: dropdownIn 0.2s ease-out;
}

.dropdown-leave-active {
  animation: dropdownOut 0.15s ease-in;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .dropdown-menu {
    min-width: 260px;
  }
  
  .user-info {
    padding: 16px;
  }
}
</style>
