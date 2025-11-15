<template>
  <!-- Overlay for mobile -->
  <div
    v-if="isAsideOpen"
    class="aside-overlay"
    @click="closeAside"
  ></div>

  <!-- Sidebar wrapper -->
  <div
    :class="[
      'sidebar position-fixed top-0 start-0 transition-all',
      isAsideOpen ? 'aside-open' : 'aside-closed',
      isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <AsideMenu
      :buildings="buildings"
      :selectedBuildingId="selectedBuildingId"
      @building-change="handleBuildingChange"
      @collapse-desktop="handleDesktopClose"
      @close-aside="closeAside"
      @check-building-and-navigate="handleCheckBuildingAndNavigate"
      :is-expanded="isExpanded"
      :is-aside-open="isAsideOpen"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AsideMenu from './AsideMenu.vue'

const props = defineProps({
  buildings: Array,
  selectedBuildingId: String,
})

const emit = defineEmits(['building-change', 'check-building-and-navigate'])

const isAsideOpen = ref(false)
const isExpanded = ref(true)
const hoverTimer = ref(null)
const isManuallyClosed = ref(false)

const openAside = () => {
  isAsideOpen.value = true
}

const handleMouseEnter = () => {
  if (window.innerWidth >= 992 && !isManuallyClosed.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = setTimeout(() => (isExpanded.value = true), 100)
  }
}

const handleMouseLeave = () => {
  if (window.innerWidth >= 992) isManuallyClosed.value = false
}

const handleDesktopClose = () => {
  if (window.innerWidth >= 992) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = setTimeout(() => {
      isManuallyClosed.value = true
      isExpanded.value = false
    }, 200)
  }
}

const closeAside = () => {
  isAsideOpen.value = false
}

const handleBuildingChange = (value) => emit('building-change', value)

const handleCheckBuildingAndNavigate = (path) =>
  emit('check-building-and-navigate', path)

onMounted(() => {
  if (window.innerWidth < 992) isExpanded.value = true
})

defineExpose({ openAside })
</script>

<style scoped>
.aside-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1030;
}

.sidebar {
  background: linear-gradient(135deg, #4361ee, #3a56d4);
  height: 100vh;
  color: #fff;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}

.aside-open {
  transform: translateX(0);
  width: 70%;
}

.aside-closed {
  transform: translateX(-100%);
}

@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80%;
    max-width: 320px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1040;
  }

  .aside-open {
    transform: translateX(0);
  }

  .aside-closed {
    transform: translateX(-100%);
  }

  .sidebar-expanded,
  .sidebar-collapsed {
    width: 100% !important;
  }
}

@media (min-width: 992px) {
  .aside-open,
  .aside-closed {
    transform: translateX(0);
    position: relative !important;
    width: auto;
  }
}

.sidebar-expanded {
  width: 300px;
}

.sidebar-collapsed {
  width: 70px;
}
</style>
