import axios from "axios";
import { useUserStore } from "../store/user";
import { message } from "ant-design-vue";
const request = axios.create({
  timeout: 1000 * 10,
  baseURL: import.meta.env.VITE_BASE_API,
});
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token =
      localStorage.getItem("GITHUB__TOKEN") || userStore.config.token;
    token && (config.headers.Authorization = `token ${token}`);
    config.params = {
      ...config.params,
      _t: Date.now()
    }
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status >= 200  && response.status < 300) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    let data = error.response.data;
    message.error(data.message);
    return Promise.reject(data);
  }
);
export default request;
