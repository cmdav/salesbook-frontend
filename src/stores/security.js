import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllRole,
  getPages,
  getRole,
  getPermissions,
  addPermissions,
  getAllPages,
  getUser,
  addRole,
  updateRole
} from '@/services/Security'

export const useSecurityStore = defineStore('Security', () => {
  const allRoles = ref({})
  const allUser = ref({})
  const allPages = ref({})
  const roles = ref({})
  const pages = ref({})
  const permissions = ref({})



    const handleAddRole = async (payload) => {
      try {
        let res = await addRole(payload)
        return res
      } catch (error) {
        console.error(error)
      }
    }
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
  const handleGetUser = async () => {
    try {
      allUser.value = await getUser()
      return allUser.value
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

  const handleGetPermissions = async (id) => {
    try {
      permissions.value = await getPermissions(id)
      return permissions.value
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddPermissions = async (id,payload) => {
    try {
      let res = await addPermissions(id,payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateRoles = async (id, payload) => {
    try{
      let res = await updateRole(id, payload)
      return res
    } catch (error){
      console.error(error)
    }
  }

  return {
    allRoles,
    allPages,
    roles,
    pages,
    permissions,
    allUser,
    handleGetAllRole,
    handleGetRole,
    handleGetPages,
    handleGetAllPages,
    handleGetPermissions,
    handleAddPermissions,
    handleGetUser,
    handleAddRole,
    handleUpdateRoles
  }
})
