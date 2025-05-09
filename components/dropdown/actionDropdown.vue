<!-- ActionDropdown.vue -->
<template>
    <div class="action-dropdown" ref="dropdownContainer">
        <button class="btn btn-sm action-btn" type="button" @click="toggleDropdown">
            <span>{{ buttonText }}</span>
            <Icon :name="iconName" :size="iconSize" />
        </button>

        <Teleport to="body">
            <ul v-show="isOpen" class="dropdown-menu" :class="{ 'show': isOpen }" :style="dropdownStyles">
                <slot :closeDropdown="closeDropdown"></slot>
            </ul>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    buttonText: { type: String, default: 'Thao tác' },
    iconName: { type: String, default: 'bx:chevron-down' },
    iconSize: { type: Number, default: 16 }
})

const dropdownContainer = ref(null)
const isOpen = ref(false)
const dropdownStyles = ref({
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: 9999,
})

// Mở/đóng dropdown
const toggleDropdown = () => {
    if (isOpen.value) {
        closeDropdown()
    } else {
        openDropdown()
    }
}

// Mở dropdown và tính toán vị trí
const openDropdown = () => {
    isOpen.value = true
    nextTick(() => {
        updateDropdownPosition()
    })
    closeAllOtherDropdowns()
}

// Đóng dropdown hiện tại
const closeDropdown = () => {
    isOpen.value = false
}

// Đóng tất cả các dropdown khác
const closeAllOtherDropdowns = () => {
    document.querySelectorAll('.action-dropdown').forEach(el => {
        if (el !== dropdownContainer.value) {
            const instance = el.__vue__
            if (instance && typeof instance.closeDropdown === 'function') {
                instance.closeDropdown()
            }
        }
    })
}

// Cập nhật vị trí dropdown dựa trên vị trí button
const updateDropdownPosition = () => {
    if (!dropdownContainer.value) return
    const buttonRect = dropdownContainer.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    dropdownStyles.value = {
        position: 'fixed',
        left: `${buttonRect.left}px`,
        minWidth: `${buttonRect.width}px`,
        zIndex: 9999,
    }
    const spaceBelow = windowHeight - buttonRect.bottom
    const menuHeight = 200
    if (spaceBelow < menuHeight && buttonRect.top > menuHeight) {
        dropdownStyles.value.bottom = `${windowHeight - buttonRect.top}px`
    } else {
        dropdownStyles.value.top = `${buttonRect.bottom}px`
    }
}

// Xử lý click ra ngoài, escape key, resize, scroll (giữ nguyên logic hiện tại)
const handleOutsideClick = (event) => {
    if (
        isOpen.value &&
        dropdownContainer.value &&
        !dropdownContainer.value.contains(event.target) &&
        !event.target.closest('.dropdown-menu')
    ) {
        closeDropdown()
    }
}

const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && isOpen.value) {
        closeDropdown()
    }
}

const handleResize = () => {
    if (isOpen.value) {
        updateDropdownPosition()
    }
}

const handleScroll = () => {
    if (isOpen.value) {
        updateDropdownPosition()
    }
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleEscapeKey)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleEscapeKey)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll, true)
    closeDropdown()
})

const nextTick = process.client ? window.requestAnimationFrame : setTimeout
</script>

<style scoped>
/* CSS cho action-dropdown */
.action-dropdown {
    position: relative;
    display: inline-block;
}

/* CSS cho button */
.btn.action-btn {
    /* Căn chỉnh và layout */
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;

    /* Màu sắc và viền */
    background-color: var(--btn-bg, #ffffff);
    color: var(--btn-color, #333333);
    border: 1px solid var(--btn-border, #d1d5db);
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    /* Hiệu ứng */
    transition: all 0.2s ease;
    cursor: pointer;
}

/* Hover */
.btn.action-btn:hover {
    background-color: var(--btn-hover-bg, #f3f4f6);
    border-color: var(--btn-hover-border, #9ca3af);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Active */
.btn.action-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Focus */
.btn.action-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Disabled */
.btn.action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Dropdown menu */
.dropdown-menu {
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    list-style: none;
    padding: 4px 0;
    margin: 0;
}

/* CSS variables cho dễ tùy chỉnh */
:root {
    --btn-bg: #ffffff;
    --btn-color: #333333;
    --btn-border: #d1d5db;
    --btn-hover-bg: #f3f4f6;
    --btn-hover-border: #9ca3af;
}
</style>
