<template>
  <Navbar/>
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">New Purchase</h2>

    <!-- Supplier -->
    <select v-model="supplierId" class="border p-2 rounded w-full mb-3">
      <option value="">Select Supplier</option>
      <option v-for="s in suppliers" :key="s.id" :value="s.id">
        {{ s.name }}
      </option>
    </select>

    <!-- Product -->
    <select v-model="productId" class="border p-2 rounded w-full mb-3">
      <option value="">Select Product</option>
      <option v-for="p in products" :key="p.id" :value="p.id">
        {{ p.name }}
      </option>
    </select>

    <div class="flex gap-2 mb-3">
      <input v-model="qty" type="number" placeholder="Qty" class="border p-2 rounded w-full" />
      <input v-model="price" type="number" placeholder="Price" class="border p-2 rounded w-full" />
    </div>

    <button @click="addItem" class="bg-blue-600 text-white px-4 py-2 rounded w-full">
      Add Item
    </button>

    <!-- Item list -->
    <div v-for="(i, index) in items" :key="index" class="mt-3 bg-gray-100 p-2 rounded">
      {{ getProductName(i.product_id) }} - {{ i.quantity }} × {{ i.price }}
    </div>

    <button
      @click="savePurchase"
      class="bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
    >
      Save Purchase
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Navbar from "../components/navbar.vue";

const suppliers = ref([]);
const products = ref([]);
const supplierId = ref("");
const productId = ref("");
const qty = ref("");
const price = ref("");
const items = ref([]);

onMounted(async () => {
  const s = await api.get("/suppliers");
  suppliers.value = s.data.data;

  const p = await api.get("/products");
  products.value = p.data.data;
});

const addItem = () => {
  items.value.push({
    product_id: productId.value,
    quantity: qty.value,
    price: price.value,
  });

  productId.value = "";
  qty.value = "";
  price.value = "";
};

const savePurchase = async () => {
  await api.post("/purchases/add", {
    supplier_id: supplierId.value,
    items: items.value,
  });

  alert("Purchase saved");
  items.value = [];
};

const getProductName = (id) => {
  return products.value.find((p) => p.id === id)?.name || "";
};
</script>