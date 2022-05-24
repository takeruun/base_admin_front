import type { Category } from 'src/models/category';

export type ListBodyPropsType = {
  categories: Category[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
