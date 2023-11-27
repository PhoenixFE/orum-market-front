export interface IProduct {
  _id: number;
  seller_id: number;
  name: string;
  price: number;
  shippingFees: number;
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
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}
