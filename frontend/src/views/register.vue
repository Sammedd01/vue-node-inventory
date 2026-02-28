<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4">Register</h2>
    <p v-if="error" class="text-red-500">{{ error }}</p>
      <input v-model="name" placeholder="Name" class="input" />
      <input v-model="email" placeholder="Email" class="input" />
      <input v-model="password" type="password" placeholder="Password" class="input" />

      <button @click="register" class="btn">Register</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const register = async () => {
  try {
    const res = await api.post("/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert(res.data.message);
    router.push("/login");
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
  }
};
</script>
