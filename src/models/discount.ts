export type DiscountType = '割合値引' | '金額値引';

export const Percentage = '割合値引';
export const PriceReduction = '金額値引';

export interface Discount {
  id: number;
  name: string;
  amount: number;
  discountType: DiscountType;
}
