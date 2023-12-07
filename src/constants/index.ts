const _id = localStorage.getItem('_id');

export const DASHBOARD_MENU = {
  buyer: [
    {
      id: 1,
      title: '구매자 대시보드',
      url: `/user/${_id}`,
    },
    {
      id: 2,
      title: '내 정보 수정',
      url: `/user/${_id}/buyer-info`,
    },
    {
      id: 3,
      title: '주문 내역',
      url: `/user/${_id}/buyer-orderlist`,
    },
    {
      id: 4,
      title: '찜한 상품',
      url: `/user/${_id}/buyer-favorite`,
    },
    {
      id: 5,
      title: '최근 본 상품',
      url: `/user/${_id}/buyer-orderlist`,
    },
  ],

  seller: [
    {
      id: 1,
      title: '판매자 대시보드',
      url: `/user/${_id}/seller-orderlist`,
    },
    {
      id: 2,
      title: '판매자 정보',
      url: `/user/${_id}/seller-info`,
    },
    {
      id: 3,
      title: '상품 관리',
      url: `/user/${_id}/product-manager`,
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
    name: '최상',
    dbCode: 1,
  },
  {
    id: 2,
    name: '상',
    dbCode: 2,
  },
  {
    id: 3,
    name: '중',
    dbCode: 3,
  },
  {
    id: 4,
    name: '하',
    dbCode: 4,
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
  { label: '최신순', value: '최신순' },
  { label: '오래된순', value: '오래된순' },
  { label: '높은가격순', value: '높은가격순' },
  { label: '낮은가격순', value: '낮은가격순' },
];
