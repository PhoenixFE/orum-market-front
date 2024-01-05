export const DASHBOARD_MENU = {
  buyer: [
    {
      id: 1,
      title: '구매자 대시보드',
      url: '/user',
    },
    {
      id: 2,
      title: '내 정보 수정',
      url: '/user/info',
    },
    {
      id: 3,
      title: '내 주문 내역',
      url: '/user/order-list',
    },
    {
      id: 4,
      title: '찜한 상품',
      url: '/user/favorites',
    },
    {
      id: 5,
      title: '최근 본 상품',
      url: '/user/recently-viewed',
    },
  ],

  seller: [
    {
      id: 1,
      title: '판매 상품 관리',
      url: '/user/seller/products',
    },
    {
      id: 2,
      title: '판매자 정보',
      url: '/user/seller/info',
    },
    {
      id: 3,
      title: '주문 관리',
      url: '/user/seller/orders',
    },
  ],
};

export const CATEGORY = {
  depth1: [
    {
      id: 1,
      name: '전체',
      dbName: 'all',
      dbCode: 'H01',
    },
    {
      id: 2,
      name: '남성',
      dbName: 'male',
      dbCode: 'H02',
    },
    {
      id: 3,
      name: '여성',
      dbName: 'female',
      dbCode: 'H03',
    },
    {
      id: 4,
      name: '아이',
      dbName: 'kids',
      dbCode: 'H04',
    },
  ],
  depth2: [
    {
      id: 1,
      name: '상의',
      dbName: 'tops',
      dbCode: 'H0101',
      url: '/category/tops',
    },
    {
      id: 2,
      name: '하의',
      dbName: 'bottoms',
      dbCode: 'H0102',
      url: '/category/bottoms',
    },
    {
      id: 3,
      name: '등산화',
      dbName: 'shoes',
      dbCode: 'H0103',
      url: '/category/shoes',
    },
    {
      id: 4,
      name: '배낭',
      dbName: 'backpacks',
      dbCode: 'H0104',
      url: '/category/backpacks',
    },
    {
      id: 5,
      name: '용품',
      dbName: 'gear',
      dbCode: 'H0105',
      url: '/category/gear',
    },
    {
      id: 6,
      name: '세트',
      dbName: 'set',
      dbCode: 'H0106',
      url: '/category/set',
    },
  ],
};

export const QUALITY = [
  {
    id: 1,
    name: '하급',
    value: 1,
  },
  {
    id: 2,
    name: '중급',
    value: 2,
  },
  {
    id: 3,
    name: '상급',
    value: 3,
  },
  {
    id: 4,
    name: '최상급',
    value: 4,
  },
];

export const PRICE_MARKS = [
  {
    value: 0,
  },
  {
    value: 10000,
  },
  {
    value: 20000,
  },
  {
    value: 30000,
  },
  {
    value: 40000,
  },
  {
    value: 50000,
  },
  {
    value: 60000,
  },
  {
    value: 70000,
  },
  {
    value: 80000,
  },
  {
    value: 90000,
  },
  {
    value: 100000,
  },
];

export const ORDER_STATE = {
  _id: 'orderState',
  title: '주문 상태',
  codes: [
    {
      sort: 1,
      code: 'OS010',
      value: '주문 완료',
    },
    {
      sort: 2,
      code: 'OS020',
      value: '결제 완료',
    },
    {
      sort: 3,
      code: 'OS030',
      value: '배송 준비중',
    },
    {
      sort: 4,
      code: 'OS035',
      value: '배송중',
    },
    {
      sort: 5,
      code: 'OS040',
      value: '배송 완료',
    },
    {
      sort: 6,
      code: 'OS110',
      value: '반품 요청',
    },
    {
      sort: 7,
      code: 'OS120',
      value: '반품 처리중',
    },
    {
      sort: 8,
      code: 'OS130',
      value: '반품 완료',
    },
    {
      sort: 9,
      code: 'OS210',
      value: '교환 요청',
    },
    {
      sort: 10,
      code: 'OS220',
      value: '교환 처리중',
    },
    {
      sort: 11,
      code: 'OS230',
      value: '교환 완료',
    },
    {
      sort: 12,
      code: 'OS310',
      value: '환불 요청',
    },
    {
      sort: 13,
      code: 'OS320',
      value: '환불 처리중',
    },
    {
      sort: 14,
      code: 'OS330',
      value: '환불 완료',
    },
  ],
};

export const SORT_OPTIONS = [
  { label: '최신순', value: '최신순', sortQuery: 'latest' },
  { label: '오래된순', value: '오래된순', sortQuery: 'oldest' },
  { label: '높은가격순', value: '높은가격순', sortQuery: 'maxPrice' },
  { label: '낮은가격순', value: '낮은가격순', sortQuery: 'minPrice' },
];

export const PRICE_BOUNDARIES: { [key: string]: { min: number; max: number } } =
  {
    전체: { min: 0, max: Infinity },
    '1만원 이하': { min: 0, max: 10000 },
    '1만원 ~ 3만원': { min: 10000, max: 30000 },
    '3만원 ~ 5만원': { min: 30000, max: 50000 },
    '5만원 ~ 7만원': { min: 50000, max: 70000 },
    '7만원 ~ 10만원': { min: 70000, max: 100000 },
    '10만원 이상': { min: 100000, max: Infinity },
    '20만원 이상': { min: 200000, max: Infinity },
  };

export const PRICE_RANGE = [
  { id: 0, label: '전체', value: '전체' },
  { id: 1, label: '1만원 이하', value: '1만원 이하' },
  { id: 2, label: '1만원 ~ 3만원', value: '1만원 ~ 3만원' },
  { id: 3, label: '3만원 ~ 5만원', value: '3만원 ~ 5만원' },
  { id: 4, label: '5만원 ~ 7만원', value: '5만원 ~ 7만원' },
  { id: 5, label: '7만원 ~ 10만원', value: '7만원 ~ 10만원' },
  { id: 6, label: '10만원 이상', value: '10만원 이상' },
  { id: 7, label: '20만원 이상', value: '20만원 이상' },
];

export const SHIPPING_FEE = [
  { id: 0, label: '전체', value: '전체' },
  { id: 1, label: '무료배송', value: '무료배송' },
  { id: 2, label: '유료배송', value: '유료배송' },
];
