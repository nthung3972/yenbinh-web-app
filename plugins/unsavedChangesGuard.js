// plugins/unsavedChangesGuard.js
import { useUnsavedChangesGuard } from '~/composables/useUnsavedChangesGuard'

export default defineNuxtPlugin(() => {
  const { setupRouteGuard } = useUnsavedChangesGuard()

  // Thiết lập router guard khi ứng dụng khởi động
  setupRouteGuard()
  
  // Cung cấp cho thành phần khác trong ứng dụng
  return {
    provide: {
      unsavedChangesGuard: useUnsavedChangesGuard
    }
  }
})