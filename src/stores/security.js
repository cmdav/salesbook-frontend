import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllRole,
  getPages,
  getRole,
  getPermissions,
  addPermissions,
  getAllPages
} from '@/services/Security'

export const useSecurityStore = defineStore('Security', () => {
  const allRoles = ref({})
  const allPages = ref({})
  const roles = ref({})
  const pages = ref({})
  const permissions = ref({})

  const handleGetAllRole = async () => {
    try {
      allRoles.value = await getAllRole()
      return allRoles.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetRole = async () => {
    try {
      roles.value = await getRole()
      return roles.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetPages = async () => {
    try {
      pages.value = await getPages()
      return pages.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetAllPages = async () => {
    try {
      allPages.value = await getAllPages()
      return allPages.value
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetPermissions = async (page) => {
    try {
      permissions.value = await getPermissions(page)
      return permissions.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleAddPermissions = async (payload) => {
    try {
      let res = await addPermissions(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  return {
    allRoles,
    allPages,
    roles,
    pages,
    permissions,
    handleGetAllRole,
    handleGetRole,
    handleGetPages,
    handleGetAllPages,
    handleGetPermissions,
    handleAddPermissions
  }
})
