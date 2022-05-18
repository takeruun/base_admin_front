import type { Administrator } from 'src/models/administrator';

export type ListBodyPropsType = {
  administrators: Administrator[];
  handleConfirmDelete: () => void;
  handleSetDeleteId: (deleteId: number) => void;
};
