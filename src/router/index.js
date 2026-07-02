import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import AuctionList from '../views/AuctionList.vue'
import AuctionDetail from '../views/AuctionDetail.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  { path: '/', name: 'AuctionList', component: AuctionList },
  { path: '/auctions/:id', name: 'AuctionDetail', component: AuctionDetail, props: true },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard: bidding requires auth, but the guard is enforced primarily
// by the backend JWT check. This just gives a friendlier redirect
// to login instead of a raw 401 in the UI.
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})

export default router
