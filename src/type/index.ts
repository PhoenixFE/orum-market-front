export type IUpdateProduct = Partial<IProduct>;
export interface IProduct {
  _id?: number | string;
  seller_id?: number;
  name: string;
  price: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  mainImages: IProductImage[];
  content: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  buyQuantity: number;
  extra: {
    isNew: boolean;
    isBest: boolean;
    category: string[];
    sort: number;
  };
}

export interface IProductImage {
  id: string;
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
  shippingFees: number;
  quantity: number;
  mainImages: {
    id: string;
    path: string;
  }[];
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
    receiver: string;
    mainAddress?: string;
    subAddress?: string;
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
  id: number | string;
  email: string;
  name: string;
  address?: string;
  extra: {
    address: [
      {
        id: number;
        addressName: string;
        receiver: string;
        tel: number | string;
        mainAddress: string;
        subAddress: string;
        name: string;
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

export interface IAddressData {
  id?: number;
  addressName?: string;
  receiver?: string;
  tel?: number | string;
  name?: string;
  mainAddress?: string;
  subAddress?: string;
}

export interface IAddressIamPort {
  address: string;
  address_detail: string;
  zonecode: string;
  addressType: string;
  bname: string;
  bname1: string;
  bname2: string;
  buildingName: string;
}

export interface ISidebarProps {
  selectedCategory: string;
  selectedPrice: string;
  selectedShippingFee: string;
  setSelectedCategory: (category: string) => void;
  setSelectedPrice: (price: string) => void;
  setSelectedShippingFee: (shippingFee: string) => void;
  resetFilters: () => void;
  isReady: boolean;
}

export interface IOrderRes {
  ok: number;
  item: IOrderItem[];
}

export interface IAddressFormProps {
  data: any;
  func: any;
  setData: any;
  submit: any;
  title: string;
  reset: any;
}
