export interface TabernaCartVariation {
  id: number;
  variation_category: string;
  variation_value: string;
}

export interface TabernaCartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  get_absolute_url: string;
}

export interface TabernaCartLineItem {
  id: number;
  quantity: number;
  sub_total?: number;
  product: TabernaCartProduct;
  variations: TabernaCartVariation[];
}

export interface TabernaCart {
  cart_items: TabernaCartLineItem[];
  quantity: number;
  total: number;
  tax: number;
  grand_total: number;
}

export interface TabernaAddToCartResponse {
  cart_id?: string;
}

export const EMPTY_TABERNA_CART: TabernaCart = {
  cart_items: [],
  quantity: 0,
  total: 0,
  tax: 0,
  grand_total: 0,
};
