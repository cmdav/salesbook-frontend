import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllOrganisation, addOrganisation } from '@/services/Organisation'

export const useOrganisationStore = defineStore('Organisation', () => {
  const organisation = ref({})
  const singleOrganisation = ref({})

  const allOrganisation = async () => {
    try {
      organisation.value = await getAllOrganisation()
      return organisation.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleAddOrganisation = async (payload) => {
    try {
      let res = await addOrganisation(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }


  return {
    organisation,
    allOrganisation,
    singleOrganisation,
    handleAddOrganisation
  }
})
