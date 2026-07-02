<template>
  <div class="container" style="max-width: 400px;">
    <div class="card">
      <h2>Register</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <form @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password (min 6 characters)" required />
        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
      <p style="margin-top: 16px;">
        Already have an account? <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import client from '../api/client'
import { useAuthStore } from '../store/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await client.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    auth.setAuth(data)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
