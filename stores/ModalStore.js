import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    showBuildingAlert: false
  }),

  actions: {
    openBuildingAlert() {
      this.showBuildingAlert = true
    },
    closeBuildingAlert() {
      this.showBuildingAlert = false
    }
  }
})
