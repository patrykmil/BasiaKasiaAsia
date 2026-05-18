import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
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
    console.log(config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;