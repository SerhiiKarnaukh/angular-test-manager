export interface TabernaProduct {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
  get_absolute_url: string;
}

export interface TabernaCategoryNavItem {
  name: string;
  get_absolute_url: string;
}

export interface TabernaCategoryWithProducts {
  name: string;
  products: TabernaProduct[];
}

export interface TabernaGalleryImage {
  image: string;
}

export interface TabernaProductDetail extends TabernaProduct {
  productgallery: TabernaGalleryImage[];
}

export interface TabernaVariationOption {
  item: unknown;
  variation_value: string;
}

export interface TabernaProductVariations {
  colors: TabernaVariationOption[];
  sizes: TabernaVariationOption[];
}

export interface TabernaProductDetailResponse {
  product: TabernaProductDetail;
  variations: TabernaProductVariations;
}

export const EMPTY_TABERNA_PRODUCT_DETAIL: TabernaProductDetailResponse = {
  product: {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    get_absolute_url: '',
    productgallery: [],
  },
  variations: {
    colors: [],
    sizes: [],
  },
};
