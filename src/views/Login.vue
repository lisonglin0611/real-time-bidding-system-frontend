<template>
  <div class="container" style="max-width: 400px">
    <div class="card">
      <h2>Log In</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <form @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="Username" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Log In" }}
        </button>
      </form>
      <p style="margin-top: 16px">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import client from "../api/client";
import { useAuthStore } from "../store/auth";

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    const { data } = await client.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    auth.setAuth(data);
    router.push(route.query.redirect || "/");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
