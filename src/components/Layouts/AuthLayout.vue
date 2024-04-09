<template>
  <main class="bg-[#F0F2F5] min-h-screen">
    <AuthPageNavbar />
    <div
      class="w-full max-h-screen flex justify-center py-12 !pb-10 mb-20 items-center lg:px-[16px] hide-scrollbar overflow-auto"
    >
      <slot></slot>
    </div>
  </main>
</template>

<script setup>
import AuthPageNavbar from "@/components/Header/AuthPageNavbar.vue";
</script>
