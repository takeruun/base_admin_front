import type { Order } from 'src/models/order';

export type ListBodyPropsType = {
  orders: Order[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
