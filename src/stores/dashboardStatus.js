import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDashboardStatus, getDashboardAutoStatus } from '@/services/DashboardStatus'

export const useDashboardStore = defineStore('DashboardStatus', () => {
  const dashboardSataus = ref({})
  const dashboardAutoSataus = ref({})

  const handleDashboardSataus = async (date) => {
    try {
      dashboardSataus.value = await getDashboardStatus(date)
      return dashboardSataus.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetDashboardAutoStatus = async () => {
    try {
      dashboardAutoSataus.value = await getDashboardAutoStatus()
      return dashboardAutoSataus.value
    } catch (error) {
      console.error(error)
    }
  }

  return {
    dashboardSataus,
    handleDashboardSataus,
    handleGetDashboardAutoStatus,
    dashboardAutoSataus
  }
})
