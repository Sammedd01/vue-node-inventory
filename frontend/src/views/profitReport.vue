<template>
    <navbar/>

    
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Profit Report</h2>

    <table class="w-full bg-white shadow rounded">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2">Product</th>
          <th class="p-2">Supplier</th>
          <th class="p-2">Qty</th>
          <th class="p-2">Buy Price</th>
          <th class="p-2">Sell Price</th>
          <th class="p-2">Profit</th>
          <th class="p-2">Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in reports" :key="r.purchase_date" class="border-t">
          <td class="p-2">{{ r.product_name }}</td>
          <td class="p-2">{{ r.supplier_name }}</td>
          <td class="p-2">{{ r.quantity }}</td>
          <td class="p-2">₹{{ r.cost_price }}</td>
          <td class="p-2">₹{{ r.selling_price }}</td>
          <td
            class="p-2 font-bold"
            :class="r.profit >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            ₹{{ r.profit }}
          </td>
          <td class="p-2">
            {{ new Date(r.purchase_date).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";
import navbar from "../components/navbar.vue";

const reports = ref([]);

const loadProfitReport = async () => {
  const res = await api.get("/reports/profit");
  reports.value = res.data.data;
};

onMounted(loadProfitReport);
</script>