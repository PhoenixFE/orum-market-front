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
