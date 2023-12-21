export type IUpdateProduct = Partial<IProduct>;
export interface IProduct {
  _id: number;
  seller_id: number;
  name: string;
  price: number;
  shippingFees: number;
  quantity: number;
  show: boolean;
  active: boolean;
  mainImages: IProductImage[];
  buyQuantity: number;
  extra: {
    isNew?: boolean;
    isBest?: boolean;
    category: string[];
    sort?: number;
  };
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface IProductImage {
  img_id: string;
  path: string;
}

export interface ICategoryPreview {
  category: {
    id: number;
    name: string;
    dbName: string;
    dbCode: string;
    url: string;
  };
  products: IProduct[];
}

export interface ICartItem {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  mainImages: string[];
}

export interface ICartStore {
  items: ICartItem[];
  addToCart: (newItem: ICartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
}

export interface IUserStore {
  isLoggedIn: boolean;
  logIn: (accessToken: string, refreshToken: string) => void;
  logOut: () => void;
}

export interface IOrderItem {
  _id: number;
  user_id: number;
  state: string;
  products: IOrderProduct[];
  cost: {
    discount: {
      products: number;
      shippingFees: number;
    };
    products: number;
    shippingFees: number;
    total: number;
  };
  address: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItemDetail extends IOrderItem {
  value: {
    name: string;
    value: string;
  };
}

interface IOrderProduct {
  _id: number;
  seller_id: number;
  state: string;
  name: string;
  image: {
    id: string;
    path: string;
  };
  quantity: number;
  price: number;
  history: [
    {
      actor: number;
      updated: {
        state: string;
        memo: string;
      };
      createdAt: string;
    },
  ];
}

export interface IUserInfo {
  id: number;
  email: string;
  name: string;
  address?: string;
  extra: {
    addressBook: [
      {
        addressName: string;
        tel: number;
        name: string;
        address_main: string;
        address_sub: string;
      },
    ];
  };
}

export interface ISearchState {
  searchQuery: string;
  searchResult: any[];
  setSearchQuery: (query: string) => void;
  setSearchResult: (result: any[]) => void;
}

export interface IRecentlyViewedStore {
  viewItems: IProduct[];
  addRecentViewProduct: (newItem: IProduct) => void;
}

export interface IProductListQuery {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface IBookmarkItem {
  _id: number;
  user_id: number;
  product_id: number;
  memo: string;
  createdAt: string;
  product: {
    name: string;
    price: number;
    quantity: number;
    buyQuantity: number;
    image: {
      id: string;
      path: string;
    };
  };
}
export interface IDashboardMenu {
  dashboardMenu: {
    buyer: {
      id: number;
      title: string;
      url: string;
    }[];
    seller: {
      id: number;
      title: string;
      url: string;
    }[];
  };
}
