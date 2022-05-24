import type { Product } from 'src/models/product';

export type ListBodyPropsType = {
  courses: Product[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
