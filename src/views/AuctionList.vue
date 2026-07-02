<template>
  <div class="container">
    <h1>Live Auctions</h1>
    <p v-if="loading">Loading auctions...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-for="auction in auctions" :key="auction.id" class="card">
      <h3>{{ auction.title }}</h3>
      <p>{{ auction.description }}</p>
      <p>Starting price: <strong>${{ auction.startingPrice }}</strong></p>
      <p>Status: <strong>{{ auction.status }}</strong> &middot; Ends {{ formatDate(auction.endTime) }}</p>
      <router-link :to="`/auctions/${auction.id}`" class="btn">View & Bid</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import client from '../api/client'

const auctions = ref([])
const loading = ref(true)
const error = ref('')

function formatDate(value) {
  return new Date(value).toLocaleString()
}

onMounted(async () => {
  try {
    const { data } = await client.get('/auctions')
    auctions.value = data
  } catch (err) {
    error.value = 'Failed to load auctions.'
  } finally {
    loading.value = false
  }
})
</script>
