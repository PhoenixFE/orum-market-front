export const DASHBOARD_MENU = {
  buyer: [
    {
      id: 1,
      title: '구매자 대시보드',
      url: '/user/:id',
    },
    {
      id: 2,
      title: '주문 내역',
      url: '/user/:id/buyer-orderlist',
    },
    {
      id: 3,
      title: '찜한 상품',
      url: '/user/:id/buyer-favorite',
    },
    {
      id: 4,
      title: '최근 본 상품',
      url: '/user/:id/buyer-orderlist',
    },
  ],

  seller: [
    {
      id: 1,
      title: '판매자 대시보드',
      url: '/user/:id/seller-orderlist',
    },
    {
      id: 2,
      title: '판매자 정보',
      url: '/user/:id/seller-info',
    },
    {
      id: 3,
      title: '상품 관리',
      url: '/user/:id/product-manager',
    },
  ],
};
