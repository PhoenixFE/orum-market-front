import axios from 'axios';
import initCreateData from '../../src/components/seller/ProductCreate';

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

export const api = {
  // 회원 가입
  signUp: (userData: any) => axiosInstance.post('/users/', userData),

  // 이메일 중복 확인
  checkEmail: (email: string) =>
    axiosInstance.get('/users/email', { params: { email } }),

  // 로그인
  signIn: (credentials: any) => axiosInstance.post('/users/login', credentials),

  // 토큰 재발행
  refreshToken: (token: string) => axiosInstance.post('/users/refresh', token),

  // 유저 정보 조회
  getUserInfo: (_id: any) => axiosInstance.get(`/users/${_id}`, _id),

  // 유저 정보 수정
  updateUserInfo: (_id: any, userData: any) =>
    axiosInstance.patch(`/users/${_id}`, userData),

  // 상품 목록 조회
  getProductList: (query = '') => axiosInstance.get(`/products/?${query}`),

  // 상품 상세 조회
  getProduct: (id: string) => axiosInstance.get(`/products/${id}`),

  // 상품 검색
  searchProducts: (keyword: string, minPrice: number, maxPrice: number) => {
    return axiosInstance.get('/products/', {
      params: {
        keyword,
        minPrice,
        maxPrice,
      },
    });
  },

  // 상품 등록
  createProduct: (productData: any) =>
    axiosInstance.post('/seller/products/', {
      ...initCreateData,
      ...productData,
      //   price: productData.price,
      //   shippingFees: productData.shippingFees,
      mainImages: productData.mainImages,
      name: productData.title,
      content: productData.content,
    }),

  // 상품 수정
  updateProduct: (productData: any) =>
    axiosInstance.patch('/seller/products/{_id}', productData),

  // 상품 삭제
  deleteProduct: (id: string) => axiosInstance.delete(`/seller/products/${id}`),

  // 파일 업로드
  uploadFile: (formData: any) =>
    axiosInstance.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // 판매자 상품 목록 조회
  getSellerProductInfo: () => axiosInstance.get('/seller/products/'),

  // 상품 결제
  checkOut: (orderData: any) => axiosInstance.post('/orders/', orderData),

  // 구매자 구매 목록 조회
  getOrderProductInfo: () => axiosInstance.get('/orders/'),
};
