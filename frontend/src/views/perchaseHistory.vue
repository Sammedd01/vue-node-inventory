<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Purchase History</h2>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">ID</th>
          <th class="p-2">Supplier</th>
          <th class="p-2">Total</th>
          <th class="p-2">Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in purchases" :key="p.id" class="border-b">
          <td class="p-2">{{ p.id }}</td>
          <td class="p-2">{{ p.supplier }}</td>
          <td class="p-2">{{ p.total }}</td>
          <td class="p-2">{{ formatDate(p.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const purchases = ref([]);

onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/purchases");
  purchases.value = res.data;
});

const formatDate = (d) => {
  return new Date(d).toLocaleString();
};
</script>