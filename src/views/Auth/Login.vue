<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AuthLayout
  >
    <LoginForm />
  </AuthLayout>
</template>
<script setup>
import AuthLayout from "@/components/Layouts/AuthLayout.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
</script>
