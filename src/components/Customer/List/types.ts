import type { Customer } from 'src/models/customer';

export type ListBodyPropsType = {
  customers: Customer[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
