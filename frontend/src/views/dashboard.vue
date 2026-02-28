<template>
  <div>
    <Navbar />

    <div class="p-6 bg-gray-100 min-h-screen">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
<canvas id="chart" class="mt-6"></canvas>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white shadow rounded p-4 text-center">
          <p class="text-gray-500">Products</p>
          <h2 class="text-2xl font-bold">{{ stats.totalProducts }}</h2>
        </div>

        <div class="bg-white shadow rounded p-4 text-center">
          <p class="text-gray-500">Suppliers</p>
          <h2 class="text-2xl font-bold">{{ stats.totalSuppliers }}</h2>
        </div>

        <div class="bg-white shadow rounded p-4 text-center">
          <p class="text-gray-500">Stock</p>
          <h2 class="text-2xl font-bold">{{ stats.totalStock }}</h2>
        </div>

        <div class="bg-white shadow rounded p-4 text-center">
          <p class="text-gray-500">Purchases</p>
          <h2 class="text-2xl font-bold">{{ stats.totalPurchases }}</h2>
        </div>
      </div>
      <div class="bg-white shadow rounded p-4 mt-4 w-100 text-center">
  <h3 class="text-lg font-bold mb-2 text-red-600">⚠ Low Stock Alert</h3>

  <div v-if="lowStock.length === 0" class="text-green-600">
    All products have sufficient stock ✅
  </div>

  <ul v-else>
    <li
      v-for="p in lowStock"
      :key="p.id"
      class="flex justify-between border-b py-1"
    >
      <span>{{ p.name }}</span>
      <span class="text-red-600 font-bold">{{ p.stock }}</span>
    </li>
  </ul>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Navbar from "../components/navbar.vue";
import Chart from "chart.js/auto";


const stats = ref({});
const lowStock = ref([]);

const loadLowStock = async () => {
  const res = await api.get("/dashboard/low-stock");
  lowStock.value = res.data.data;
};

onMounted(loadLowStock);

onMounted(async () => {
  const res = await api.get("/dashboard/stats");
  stats.value = res.data.data;

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: ["Products", "Suppliers", "Purchases"],
      datasets: [{
        label: "Count",
        data: [
          stats.value.totalProducts,
          stats.value.totalSuppliers,
          stats.value.totalPurchases
        ]
      }]
    }
  });
});


</script>