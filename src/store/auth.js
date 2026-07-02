import { defineStore } from "pinia";

// Persists the JWT + basic user info in localStorage so the session
// survives a page refresh. The token is attached to outgoing requests
// by the axios interceptor in src/api/client.js.
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    username: localStorage.getItem("username") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth({ token, userId, username }) {
      this.token = token;
      this.userId = userId;
      this.username = username;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
    },

    logout() {
      this.token = null;
      this.userId = null;
      this.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    },
  },
});
