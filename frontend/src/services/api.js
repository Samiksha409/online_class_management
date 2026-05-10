import axios from "axios";

// ================= BASE URL =================
const BASE_URL = "http://localhost:8000/api";

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");

        // ✅ FIXED refresh URL
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ================= AUTH API =================
export const authAPI = {
  // ✅ FIXED LOGIN
  login: (data) => axios.post(`${BASE_URL}/token/`, data),
};

// ================= GENERIC SAFE GET =================
const safeGet = (url) => api.get(url);

// ================= APIs =================
export const membersAPI = { getAll: () => safeGet("/members/") };
export const classesAPI = { getAll: () => safeGet("/classes/") };
export const instructorsAPI = { getAll: () => safeGet("/instructors/") };
export const schedulesAPI = { getAll: () => safeGet("/schedules/") };

export default api;