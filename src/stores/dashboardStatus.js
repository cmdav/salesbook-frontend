import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDashboardStatus } from '@/services/DashboardStatus'

export const useDashboardStore = defineStore('DashboardStatus', () => {
  const dashboardSataus = ref({})

  const handleDashboardSataus = async (date) => {
    try {
      dashboardSataus.value = await getDashboardStatus(date)
      return dashboardSataus.value
    } catch (error) {
      console.error(error)
    }
  }

  return {
    dashboardSataus,
    handleDashboardSataus,
  }
})
