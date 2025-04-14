import { ref, computed } from 'vue'
import { useRouter, navigateTo } from '#app'

export function useUnsavedChangesGuard() {
  const hasUnsavedChanges = ref(false)
  const pendingNavigation = ref(null)
  const showConfirmModal = ref(false)

  const router = useRouter()

  // Thiết lập bảo vệ định tuyến toàn cục
  const setupRouteGuard = () => {
    router.beforeEach((to, from, next) => {
      // Nếu không có thay đổi chưa lưu, cho phép chuyển hướng bình thường
      if (!hasUnsavedChanges.value) {
        return next()
      }

      // Lưu lại thông tin điều hướng đang chờ
      pendingNavigation.value = { to, next }
      
      // Hiển thị modal xác nhận thay vì chuyển hướng ngay lập tức
      showConfirmModal.value = true
      
      // Ngăn chặn chuyển hướng cho đến khi người dùng xác nhận
      return false
    })
  }

  // Thiết lập trạng thái chỉnh sửa
  const setEditing = (isEditing) => {
    hasUnsavedChanges.value = isEditing
  }

  // Xác nhận chuyển hướng và tiếp tục
  const confirmNavigation = () => {
    if (pendingNavigation.value) {
      // Tiếp tục chuyển hướng đã bị hoãn
      pendingNavigation.value.next()
      // Đặt lại trạng thái
      hasUnsavedChanges.value = false
      showConfirmModal.value = false
      pendingNavigation.value = null
    }
  }

  // Hủy bỏ chuyển hướng
  const cancelNavigation = () => {
    pendingNavigation.value = null
    showConfirmModal.value = false
  }

  // Helper để chuyển hướng theo cách thủ công (nếu cần)
  const navigateSafely = async (path) => {
    if (!hasUnsavedChanges.value) {
      return navigateTo(path)
    }

    // Lưu lại path định chuyển hướng đến
    pendingNavigation.value = { path }
    showConfirmModal.value = true
    
    // Trả về promise để có thể await nếu cần
    return new Promise((resolve) => {
      // Cập nhật hàm xác nhận để resolve promise
      const originalConfirm = confirmNavigation
      confirmNavigation = () => {
        originalConfirm()
        navigateTo(path).then(resolve)
      }
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