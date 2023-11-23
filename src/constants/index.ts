export const DASHBOARD_MENU = {
  buyer: [
    {
      title: '구매자 대시보드',
      url: '/user/:id',
    },
    {
      title: '주문 내역',
      url: '/user/:id/buyer-orderlist',
    },
    {
      title: '찜한 상품',
      url: '/user/:id/buyer-favorite',
    },
    {
      title: '최근 본 상품',
      url: '/user/:id/buyer-orderlist',
    },
  ],

  seller: [
    {
      title: '판매자 대시보드',
      url: '/user/:id/seller-orderlist',
    },
    {
      title: '판매자 정보',
      url: '/user/:id/seller-info',
    },
    {
      title: '상품 관리',
      url: '/user/:id/product-manager',
    },
  ],
};
