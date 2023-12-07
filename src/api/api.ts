import axios from 'axios';
import mem from 'mem';
import initCreateData from '../../src/components/seller/ProductCreate';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_URL = '/users/refresh';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 5,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Token Refresh Function
const getAccessToken = mem(
  async function () {
    try {
      const {
        data: {
          item: {
            token: { accessToken },
          },
        },
      } = await axiosInstance.get('/users/refresh');
      return accessToken;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  { maxAge: 1000 },
);

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
    const { config, response } = error;
    console.error('interceptors err', error);

    if (response.status === 401) {
      if (
        response.data.errorName === 'TokenExpiredError' &&
        config.url !== REFRESH_URL
      ) {
        console.log('Access token expired. Trying to refresh...');
        const newAccessToken = await getAccessToken();

        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          localStorage.setItem('accessToken', newAccessToken);
          return axios(error.config);
        }
      } else {
        alert('로그인이 필요한 서비스입니다.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else {
      const error = response?.data?.error;
      if (!response || error) {
        alert(
          error?.message ||
            `요청하신 작업처리에 실패했습니다. 잠시후 다시 요청하시기 바랍니다.`,
        );
      }
    }

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

  // 유저 정보 조회
  getUserInfo: (_id: any) => axiosInstance.get(`/users/${_id}`, _id),

  // 유저 정보 수정
  updateUserInfo: (_id: any, userData: any) =>
    axiosInstance.patch(`/users/${_id}`, userData),

  // 상품 목록 조회
  getProductList: (query = '') => axiosInstance.get(`/products/?${query}`),

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
    axiosInstance.post('/files/', formData, {
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
