const axiosInstance = axios.create({
  baseURL: "",
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default axiosInstance;
