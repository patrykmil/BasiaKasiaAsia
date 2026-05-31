import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const instance = axios.create({
  baseURL: `${apiBaseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const type = sessionStorage.getItem("access_token_type");
    const token = sessionStorage.getItem("token");

    if (type && token) {
      config.headers["Authorization"] = `${JSON.parse(type)} ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
