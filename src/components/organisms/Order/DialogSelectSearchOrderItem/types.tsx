import { Product, ProductType } from 'src/models/product';

export type DialogSelectSearchOrderItemPropsType = {
  handleCreateOrderItemClose: () => void;
  productType: ProductType;
  selectProductIds: number[];
  addOrderItem: (product: Product) => void;
};

export type SelectSearchOrderItemFormInputType = {
  categoryId: number;
  name: string;
};
