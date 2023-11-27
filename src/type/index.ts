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
