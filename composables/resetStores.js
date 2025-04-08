import { useDashboardStore } from '@/stores/dashboard'

export const resetAllStores = () => {
  useDashboardStore().resetStore()
  // thêm các store khác nếu cần
}
