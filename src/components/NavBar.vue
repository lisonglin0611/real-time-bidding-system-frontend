<template>
  <nav>
    <div>
      <router-link to="/">JLZ Auctions</router-link>
    </div>
    <div>
      <template v-if="auth.isAuthenticated">
        <span style="color: #fff; margin-right: 12px"
          >Hi, {{ auth.username }}</span
        >
        <button @click="handleLogout">Log out</button>
      </template>
      <template v-else>
        <router-link to="/login">Log in</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/");
}
</script>
