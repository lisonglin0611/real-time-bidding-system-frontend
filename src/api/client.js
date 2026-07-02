import axios from 'axios'
import { useAuthStore } from '../store/auth'

const client = axios.create({
  baseURL: '/api'
})

// Attach the JWT (if present) to every outgoing request.
client.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// If the token is invalid/expired, log the user out so the UI
// reflects reality instead of silently failing requests.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore()
      auth.logout()
    }
    return Promise.reject(error)
  }
)

export default client
