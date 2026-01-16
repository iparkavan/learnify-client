// src/lib/axios-client.ts
import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "./contants";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  // timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// // ✅ Response interceptor — handle 401 (unauthorized)
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { response } = error;

//     if (response?.status === 401) {
//       if (typeof window !== "undefined") {
//         console.warn("🔒 Token expired or invalid. Logging out...");

//         // try {
//         //   // 🧹 Clear Zustand store (safe outside React)
//         //   // useUserStore.getState().clearUser?.();
//         //   // 🧹 Remove token cookie
//         //   // Cookies.remove(ACCESS_TOKEN);
//         //   // 🔁 Redirect to login
//         //   // window.location.href = "/login"; // change to "/" if needed
//         // } catch (err) {
//         //   console.error("Error during 401 handling:", err);
//         // }
//       }
//     }

//     const handledError = handleApiError(error);
//     console.error("📦 API Error:", handledError);

//     return Promise.reject(handledError);
//   }
// );

export default axiosClient;

// // lib/axios.ts
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useUserStore } from "@/stores/user-info-store";
// import { ACCESS_TOKEN } from "./constants";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   timeout: 10000,
//   withCredentials: true,
// });

// // // ✅ Request interceptor: attach JWT from cookies
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get(ACCESS_TOKEN);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor: handle 401 errors cleanly
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { response } = error;

//     if (response?.status === 401) {
//       if (typeof window !== "undefined") {
//         // ✅ Clear Zustand store directly (safe outside React)
//         // useUserStore.getState().clearUser();
//         // Cookies.remove(ACCESS_TOKEN);
//         // ✅ Remove token and redirect
//         // window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
