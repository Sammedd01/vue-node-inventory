<template>
 <div class="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 shadow-lg flex justify-between">
  <h1 class="text-xl font-bold">Inventory System</h1>
  <div class="space-x-6">
      <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
      <router-link to="/products" class="hover:underline">Products</router-link>
      <router-link to="/suppliers" class="hover:underline">Suppliers</router-link>
      <router-link to="/purchases" class="hover:underline">Purchases</router-link>
      <router-link v-if="user.role === 'admin'" to="/profit-report" class="hover:underline">profit-Report</router-link>

      <button @click="logout" class="bg-red-500 px-3 py-1 rounded">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
});
</script>