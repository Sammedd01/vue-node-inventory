<template>
 <div>
    <Navbar />

    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">Products</h2>

      <!-- Search -->
      <input
        v-model="search"
        placeholder="Search product..."
        class="border p-2 rounded mb-3 ml-3.5"
      />

      <!-- Add Product Form -->
      <div class="bg-white shadow rounded p-4 flex gap-3 mb-6">
        <input v-model="name" placeholder="Name" class="border p-2 rounded w-48" />
        <input v-model="category" placeholder="Category" class="border p-2 rounded w-40" />
        <input v-model="price" placeholder="Price" type="number" class="border p-2 rounded w-32" />
        <input v-model="stock" placeholder="Stock" type="number" class="border p-2 rounded w-28" />

        <button @click="addProduct"  v-if="isAdmin" class="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      <!-- Products Table -->
      <table class="w-full bg-white shadow rounded overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2">Name</th>
            <th class="p-2">Category</th>
            <th class="p-2">Price</th>
            <th class="p-2">Stock</th>
            <th class="p-2">Status</th>
            <th class="p-2">Created</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in filteredProducts"
            :key="p.id"
            class="border-t"
            :class="p.stock <= 5 ? 'bg-red-50' : ''"
          >
            <td class="p-2">
              <input v-model="p.name" class="border p-1 w-full" />
            </td>

            <td class="p-2">
              <input v-model="p.category" class="border p-1 w-full" />
            </td>

            <td class="p-2">
              <input v-model="p.price" class="border p-1 w-full" />
            </td>

          <td class="p-2">
  <input v-model="p.stock" type="number" class="border p-1 w-full" />
</td>

            <td class="p-2">
              <span v-if="p.stock > 0" class="text-green-600 font-semibold">In Stock</span>
              <span v-else class="text-red-600 font-semibold">Out of Stock</span>
            </td>

            <td class="p-2">
              {{ new Date(p.created_at).toLocaleDateString() }}
            </td>

            <td class="p-1 space-x-2">
              <button  v-if="isAdmin" @click="updateProduct(p)" class="bg-yellow-400 px-3 py-1 pl-7.5 rounded">Edit</button>
              <button   v-if="isAdmin" @click="deleteProduct(p.id)" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";
import Navbar from "../components/navbar.vue";

const products = ref([]);
const name = ref("");
const category = ref("");
const price = ref("");
const stock = ref("");
const search = ref("");

const loadProducts = async () => {
  const res = await api.get("/products");
  products.value = res.data.data;
};

const addProduct = async () => {
  await api.post("/products/add", {
    name: name.value,
    category: category.value,
    price: price.value,
    stock: stock.value,
  });

  name.value = "";
  category.value = "";
  price.value = "";
  stock.value = "";
  loadProducts();
};

const updateProduct = async (p) => {
  try {
    await api.put(`/products/${p.id}`, {
      name: p.name,
      category: p.category,
      sku: p.sku || null,
      price: p.price,
      stock: p.stock,
    });
    loadProducts();
  } catch (err) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Update failed");
  }
};

const deleteProduct = async (id) => {
  try {
    if (!confirm("Delete product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    alert("Delete failed");
  }
};


const filteredProducts = computed(() => {
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});
const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
});

const isAdmin = computed(() => user.value?.role === "admin");

onMounted(loadProducts);
</script>