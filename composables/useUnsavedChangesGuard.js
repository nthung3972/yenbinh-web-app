import { ref, computed } from 'vue'
import { useRouter, navigateTo } from '#app'

export function useUnsavedChangesGuard() {
  const hasUnsavedChanges = ref(false)
  const pendingNavigation = ref(null)
  const showConfirmModal = ref(false)
  const confirmCallback = ref(null)

  const router = useRouter()

  // Thiết lập bảo vệ định tuyến toàn cục
  const setupRouteGuard = () => {
    router.beforeEach((to, from) => {
      if (!hasUnsavedChanges.value) {
        return true // Cho phép tiếp tục
      }
    
      // Chặn lại và hiển thị modal
      pendingNavigation.value = to
      showConfirmModal.value = true
      return false // Ngăn điều hướng
    })
  }

  // Thiết lập trạng thái chỉnh sửa
  const setEditing = (isEditing) => {
    hasUnsavedChanges.value = isEditing
  }

  // Xác nhận chuyển hướng và tiếp tục
  const confirmNavigation = () => {
    if (pendingNavigation.value) {
      router.push(pendingNavigation.value)
      hasUnsavedChanges.value = false
      showConfirmModal.value = false
      pendingNavigation.value = null
      confirmCallback.value = null
    }
  }

  // Hủy bỏ chuyển hướng
  const cancelNavigation = () => {
    pendingNavigation.value = null
    showConfirmModal.value = false
  }

  const navigateSafely = (path) => {
    if (!hasUnsavedChanges.value) {
      return navigateTo(path)
    }
  
    return new Promise((resolve) => {
      pendingNavigation.value = { path }
      confirmCallback.value = resolve
      showConfirmModal.value = true
    })
  }

  return {
    hasUnsavedChanges,
    showConfirmModal,
    setupRouteGuard,
    setEditing,
    confirmNavigation,
    cancelNavigation,
    navigateSafely
  }
}