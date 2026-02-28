<template>
 <div>
  <Navbar/>
    <div class="max-w-5xl mx-auto p-6">
      <h2 class="text-xl font-bold mb-4">Suppliers</h2>

      <div class="bg-white shadow rounded p-4 flex gap-3 mb-6">
        <input v-model="name" placeholder="Supplier Name"
          class="border p-2 rounded w-full" />
        <button  v-if="isAdmin" @click="addSupplier"
          class="bg-green-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      <ul class="bg-white shadow rounded p-4">
        <li v-for="s in suppliers" :key="s.id" class="border-b p-2 flex justify-between">
  <input v-model="s.name" class="border p-1" />
  <div>
    <button  v-if="isAdmin" @click="updateSupplier(s)" class="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
    <button  v-if="isAdmin" @click="deleteSupplier(s.id)" class="bg-red-500 text-white px-2 py-1">Delete</button>
  </div>
</li>
       
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import Navbar from "../components/navbar.vue";

const suppliers = ref([]);
const name = ref("");

const loadSuppliers = async () => {
  const res = await api.get("/suppliers");
  suppliers.value = res.data.data;
};

const addSupplier = async () => {
  await api.post("/suppliers/add", { name: name.value });
  name.value = "";
  loadSuppliers();
};
const updateSupplier = async (s) => {
  await api.put("/suppliers/" + s.id, s);
  alert("Updated");
};

const deleteSupplier = async (id) => {
  if (!confirm("Delete supplier?")) return;
  await api.delete("/suppliers/" + id);
  loadSuppliers();
};

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
});

const isAdmin = computed(() => user.value?.role === "admin");

onMounted(loadSuppliers);
</script>