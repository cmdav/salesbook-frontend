<template>
  <div
    :class="inputClasses"
    class="relative h-[126.955px] w-[126.955px] bg-secondary-800/[40%] rounded-full"
  >
    <img
      :class="inputClasses"
      :src="imageUrl ? imageUrl : Avater"
      class="h-[126.955px] w-[126.955px] bg-[#0A090991] opacity-80 object-cover rounded-full"
    /><button @click="toggleModal" class="absolute top-4 text-[#000000] right-1">
      <EditIcon />
    </button>
  </div>
</template>
<script setup>
import EditIcon from '@/components/icons/editIcon.vue'
import Avater from '@/assets/svg/profileIcon.svg'

defineProps({
  inputClasses: String,
  imageUrl: String
})
const emit = defineEmits(['toggleModal']) // Destructure `emit` from the result of defineEmits

const toggleModal = () => {
  emit('toggleModal')
}
</script>
