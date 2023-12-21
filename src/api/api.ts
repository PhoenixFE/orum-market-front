import axios from 'axios';
import initCreateData from '../../src/components/seller/ProductCreate';
import { IProduct } from '../type';
import { useUserStore } from '../lib/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_URL = '/users/refresh';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 20,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.accessToken;
    if (config.url === REFRESH_URL) {
      token = localStorage.refreshToken;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    if (response.status === 401) {
      switch (response.data.errorName) {
        case 'TokenExpiredError':
          // Attempt to refresh the token
          if (originalRequest.url !== REFRESH_URL) {
            try {
              const newAccessToken = await getAccessToken();
              if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers['Authorization'] =
                  `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Failed to refresh token', refreshError);
              return Promise.reject(refreshError);
            }
          }
          break;

        case 'JsonWebTokenError':
          (useUserStore.getState() as any).logOut();
          window.location.href = '/sign-in';
          break;

        case 'EmptyAuthorization':
          console.error('Authorization header is missing', response.data);
          window.location.href = '/sign-in';
          break;

        default:
          console.error(`Error: ${response.data.errorName}`, response.data);
          break;
      }
    }

    if (!response || response.status !== 401 || !response.data.errorName) {
      console.error('An unexpected error occurred', error);
    }

    return Promise.reject(error);
  },
);

async function getAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.get(REFRESH_URL, {
      params: { refreshToken },
    });
    const { accessToken } = response.data;
    return accessToken;
  } catch (err) {
    console.error('Error refreshing token', err);
    throw err;
  }
}

export const api = {
  // 회원 가입
  signUp: (userData: any) => axiosInstance.post('/users/', userData),

  // 이메일 중복 확인
  checkEmail: (email: string) =>
    axiosInstance.get('/users/email', { params: { email } }),

  // 로그인
  signIn: (credentials: any) => axiosInstance.post('/users/login', credentials),

  // 유저 정보 조회
  getUserInfo: (_id: any) => axiosInstance.get(`/users/${_id}`),

  // 유저 정보 수정
  updateUserInfo: (_id: any, userData: any) =>
    axiosInstance.patch(`/users/${_id}`, userData),

  // 상품 목록 조회
  getProductList: (query: IProductListQuery = {}) => {
    const queryString = new URLSearchParams(query as any).toString();
    const response = axiosInstance.get(`/products/?${queryString}`);
    return response;
  },

  // 상품 카테고리 조회
  getProductListByCategory: (extraQuery: string) =>
    axiosInstance.get(`/products/?extra=${extraQuery}`),

  // 상품 상세 조회
  getProduct: (_id: number) => axiosInstance.get(`/products/${_id}`),

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
      name: productData.name,
      content: productData.content,
    }),

  // 상품 수정
  updateProduct: (_id: string, productData: IProduct) =>
    axiosInstance.patch(`/seller/products/${_id}`, productData),

  // 상품 삭제
  deleteProduct: (id: string) => axiosInstance.delete(`/seller/products/${id}`),

  // 파일 업로드
  uploadFile: (formData: any) =>
    axiosInstance.post('/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // 판매자 상품 목록 조회
  getSellerProductInfo: () => axiosInstance.get(`/seller/products/`),

  // 상품 결제
  checkOut: (orderData: any) => axiosInstance.post('/orders/', orderData),

  // 구매자 구매 목록 조회
  getOrderProductInfo: () => axiosInstance.get('/orders/'),

  //판매자 주문 목록 조회
  getOrderState: () => axiosInstance.get('seller/orders/'),

  //판매자 주문상태 관리
  updateOrderState: (product_id: number) =>
    axiosInstance.patch(`/seller/orders/${product_id}`, product_id),

  // 북마크 조회
  getBookmark: (product_id: number) =>
    axiosInstance.get(`/bookmarks/products/${product_id}`),

  // 북마크 추가
  addBookmark: (product_id: number, user_id: number) => {
    return axiosInstance.post(`/bookmarks`, { product_id, user_id });
  },

  // 북마크 제거
  removeBookmark: (bookmark_id: number) =>
    axiosInstance.delete(`/bookmarks/${bookmark_id}`),

  // 내 북마크 목록 조회
  getMyBookMark: () => axiosInstance.get('/bookmarks/'),

  // 구매자 구매 상세 조회
  getOrderProductDetail: (order_id: number) =>
    axiosInstance.get(`/orders/${order_id}`),

  // 후기 등록(별점)
  addRating: (ratingData: any) => axiosInstance.post(`/replies`, ratingData),
};

interface IProductListQuery {
  page?: number;
}
