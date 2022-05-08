import { Discount } from './discount';
import { Product } from './product';

export interface OrderItem {
  id: number;
  productId: number;
  price: number;
  taxRate: number;
  quantity: number;
  otherPerson: boolean;
  product: Product;
  discountId: number;
  discountAmount: number;
  discountRate: number;
  discount: Discount;
}
