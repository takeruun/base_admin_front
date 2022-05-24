import type { Category } from './category';
export type ProductType = 'コース' | '商品' | 'その他';
export const Course = 'コース';
export const Goods = '商品';
export const Other = 'その他';

export const productTypes = [
  {
    value: 0,
    label: Other
  },
  {
    value: 1,
    label: Course
  },
  {
    value: 2,
    label: Goods
  }
];

export const getProdcutTypeValue = (pt: ProductType): number =>
  productTypes.find((p) => p.label == pt).value;

export const getProdcutTypeLabel = (pt: ProductType): string =>
  productTypes.find((p) => p.label == pt).label;

export interface Product {
  id: number;
  name: string;
  price: number;
  productType: ProductType;
  categoryId: string;
  createdAt: string;
  category: Category;
}
