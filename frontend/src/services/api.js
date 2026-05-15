import axios from "axios";

// Match Django host: use same host you open in browser (localhost vs 127.0.0.1) to avoid CORS surprises.
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
    /\/$/,
    ""
  );

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
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

export const authAPI = {
  login: (data) => axios.post(`${BASE_URL}/auth/token/`, data),
  register: (data) => axios.post(`${BASE_URL}/auth/register/`, data),
  profile: () => api.get("/auth/profile/"),
};

const crudFactory = (path) => ({
  getAll: (params = {}) => api.get(path, { params }),
  getOne: (id) => api.get(`${path}${id}/`),
  create: (payload) => api.post(path, payload),
  update: (id, payload) => api.put(`${path}${id}/`, payload),
  delete: (id) => api.delete(`${path}${id}/`),
});

export const dashboardAPI = {
  summary: () => api.get("/dashboard/summary/"),
};

export const coursesAPI = crudFactory("/courses/");
export const classesAPI = crudFactory("/class-sessions/");
export const assignmentsAPI = crudFactory("/assignments/");
export const submissionsAPI = crudFactory("/submissions/");
export const attendanceAPI = crudFactory("/attendance/");
export const studyMaterialsAPI = crudFactory("/study-materials/");
export const noticesAPI = crudFactory("/notices/");
export const membersAPI = {
  getAll: () => api.get("/auth/students/"),
};
export const instructorsAPI = {
  getAll: () => api.get("/auth/teachers/"),
};
export const schedulesAPI = {
  getAll: () => api.get("/class-sessions/"),
};
export const typesAPI = {
  ...crudFactory("/courses/"),
};

export default api;