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
  };
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface ICategoryPreview {
  category: string;
  products: IProduct[];
}

export interface CartItem {
  _id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ICartStore {
  items: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
}

export interface IUserStore {
  isLoggedIn: boolean;
  logIn: (token: string) => void;
  logOut: () => void;
}
