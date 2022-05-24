import type { Product } from 'src/models/product';

export type ListBodyPropsType = {
  products: Product[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
