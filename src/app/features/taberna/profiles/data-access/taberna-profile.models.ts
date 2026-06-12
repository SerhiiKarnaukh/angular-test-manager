import { TabernaCartProduct, TabernaCartVariation } from '@features/taberna/cart/data-access/taberna-cart.models';

export interface TabernaOrderPayment {
  status: string;
  payment_method: string;
}

export interface TabernaOrderProductLine {
  id: number;
  quantity: number;
  product_price: number;
  product: TabernaCartProduct;
  variations: TabernaCartVariation[];
}

export interface TabernaUserOrder {
  id: number;
  order_number: string;
  created_at: string;
  tax: number | string;
  order_total: number | string;
  payment?: TabernaOrderPayment;
  order_products: TabernaOrderProductLine[];
}
