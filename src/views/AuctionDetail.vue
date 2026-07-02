<template>
  <div class="container">
    <router-link to="/">&larr; Back to auctions</router-link>

    <div class="card" v-if="auction">
      <h1>{{ auction.title }}</h1>
      <p>{{ auction.description }}</p>
      <p>Status: <strong>{{ auction.status }}</strong> &middot; Ends {{ formatDate(auction.endTime) }}</p>

      <div style="margin: 20px 0;">
        <div>Current highest bid</div>
        <div class="highest-bid">${{ currentBid?.highestBid ?? auction.startingPrice }}</div>
        <div v-if="currentBid?.highestBidder">by {{ currentBid.highestBidder }}</div>
        <div style="font-size: 12px; color: #888;">Auto-refreshing every 2s</div>
      </div>

      <form v-if="auth.isAuthenticated" @submit.prevent="handlePlaceBid">
        <input v-model="bidAmount" type="number" step="0.01" min="0" placeholder="Your bid amount" required />
        <button class="btn" type="submit" :disabled="placingBid">
          {{ placingBid ? 'Placing bid...' : 'Place Bid' }}
        </button>
        <p v-if="bidError" class="error">{{ bidError }}</p>
        <p v-if="bidSuccess" style="color: #27ae60;">Bid placed successfully!</p>
      </form>
      <p v-else>
        <router-link :to="`/login?redirect=/auctions/${auctionId}`">Log in</router-link> to place a bid.
      </p>
    </div>

    <div class="card" v-if="bidHistory.length">
      <h3>Bid History</h3>
      <ul>
        <li v-for="(bid, idx) in bidHistory" :key="idx">
          {{ bid.username }} bid ${{ bid.amount }} at {{ formatTime(bid.timestamp) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import client from '../api/client'
import { useAuthStore } from '../store/auth'

const props = defineProps({ id: { type: String, required: true } })
const auctionId = props.id

const auth = useAuthStore()

const auction = ref(null)
const currentBid = ref(null)
const bidHistory = ref([])
const bidAmount = ref('')
const bidError = ref('')
const bidSuccess = ref(false)
const placingBid = ref(false)

let pollHandle = null

function formatDate(value) {
  return new Date(value).toLocaleString()
}

function formatTime(epochMillis) {
  return new Date(epochMillis).toLocaleTimeString()
}

async function loadAuction() {
  const { data } = await client.get(`/auctions/${auctionId}`)
  auction.value = data
}

async function loadCurrentBid() {
  const { data } = await client.get(`/auctions/${auctionId}/bids/current`)
  currentBid.value = data
}

async function loadBidHistory() {
  const { data } = await client.get(`/auctions/${auctionId}/bids/history`)
  bidHistory.value = data
}

async function handlePlaceBid() {
  bidError.value = ''
  bidSuccess.value = false
  placingBid.value = true
  try {
    await client.post(`/auctions/${auctionId}/bids`, { amount: Number(bidAmount.value) })
    bidSuccess.value = true
    bidAmount.value = ''
    await Promise.all([loadCurrentBid(), loadBidHistory()])
  } catch (err) {
    bidError.value = err.response?.data?.message || 'Failed to place bid.'
  } finally {
    placingBid.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadAuction(), loadCurrentBid(), loadBidHistory()])
  // Real-time updates via polling: simple and reliable for a demo.
  // A production system might upgrade this to WebSockets/SSE, but
  // polling keeps the client simple and works through any proxy/LB.
  pollHandle = setInterval(loadCurrentBid, 2000)
})

onUnmounted(() => {
  if (pollHandle) clearInterval(pollHandle)
})
</script>
