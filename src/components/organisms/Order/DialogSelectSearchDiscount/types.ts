import { Discount } from 'src/models/discount';

export type DialogSelectSearchDiscountProps = {
  open: boolean;
  discountOrderItem: number;
  handleDiscountClose: () => void;
  selectDiscount: (discountOrderItem: number, discount: Discount) => void;
};
