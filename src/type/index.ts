export interface IProduct {
  _id: number;
  seller_id: number;
  name: string;
  price: number;
  shippingFees: number;
  quantity: number;
  show: boolean;
  active: boolean;
  mainImages: string[];
  extra: {
    isNew: boolean;
    isBest: boolean;
    category: string[];
    quantity: number;
    buyQuantity: number;
    order: number;
    sort: number;
  };
  createdAt: string;
  updatedAt: string;
  content: string;
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
  products: IProduct[];
  cost: {
    discount: number[];
    products: number;
    shippingFees: number;
    total: number;
  };
  address: string[];
  createdAt: string;
  updatedAt: string;
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
  viewdItems: IProduct[];
  addRecentViewProduct: (newItem: IProduct) => void;
}
