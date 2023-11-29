import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// api 함수 정의
export const api = {
  signUp: (userData: any) => axiosInstance.post('/users/', userData),
  checkEmail: (email: string) =>
    axiosInstance.get('/users/email', { params: { email } }),
  signIn: (credentials: any) => axiosInstance.post('/users/login', credentials),
  getProductList: () => axiosInstance.get('/products'),
  getProduct: (id: string) => axiosInstance.get(`/products/${id}`),
  searchProducts: (keyword: string) =>
    axiosInstance.get('/products', { params: { keyword } }),
  getUserInfo: (_id: any) => axiosInstance.get(`/users/${_id}`, _id),
  updateUserInfo: (_id: any, userData: any) =>
    axiosInstance.patch(`/users/${_id}`, userData),
  checkOut: (orderData: any) => axiosInstance.post('/orders/', orderData),
};
