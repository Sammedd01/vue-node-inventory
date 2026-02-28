<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
     <p v-if="error" class="text-red-500">{{ error }}</p>
      <input v-model="email" placeholder="Email" class="input border p-1 w-full" />
      <input v-model="password" type="password" placeholder="Password" class="input border p-1 w-full" />

      <button @click="login" class="btn bg-green-500 px-3 py-1 rounded">Login</button>

      <p class="mt-3 text-sm">
        No account?
        <router-link to="/register" class="text-blue-500">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  }
};
</script>
