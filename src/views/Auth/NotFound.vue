
<template>
  <AuthLayout>
    <div>
      <p>This page does not exist</p>
      <div class="button-group">
        <router-link to="/login">
          <button class="btn btn-primary">Login as Individual/Company</button>
        </router-link>
        <router-link to="/supplier/login">
          <button class="btn btn-secondary">Login as Supplier</button>
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "@/components/Layouts/AuthLayout.vue";
</script>

<style scoped>
.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}
.btn:hover {
  opacity: 0.8;
}
</style>
