import axios from "axios";
import { create } from "zustand";

export const useAuth = create((set) => ({
  currentUser: null,
  articles: [],
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;

    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj,
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Login failed",
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.get(
        "http://localhost:4000/common-api/logout",
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:4000/common-api/check-auth", { withCredentials: true });

      if (res.data.isAuthenticated) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Auth check failed:", err);
      }
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }
}));