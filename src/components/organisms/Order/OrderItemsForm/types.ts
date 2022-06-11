import { ProductType } from 'src/models/product';
import { PaymentMethod, Status } from 'src/models/order';

type OrderItemFormInputType = {
  id?: number | null;
  name: string;
  productId: number;
  price: number;
  quantity: number;
  taxRate: number;
  otherPerson: boolean;
  productType: ProductType;
  discountId?: number | null;
  discountRate: number;
  discountAmount: number;
  discountName?: string;
};

export type OrderFormInputType = {
  customerId: number;
  dateOfVisit: string;
  dateOfVisitTime: string;
  dateOfExit: string;
  orderItems: OrderItemFormInputType[];
  status: Status;
  paymentMethod: PaymentMethod;
  discountAmount: number;
  subTotalPrice: number;
  totalPrice: number;
};

export type SelectSearchOrderItemFormInputType = {
  categoryId: number;
  name: string;
};

export type OrderItemsProps = {
  productType: ProductType;
  handleCreateOrderItemOpen: (pt: ProductType) => void;
  removeOrderItem?: (orderItemId?: number) => void;
  handleDiscountOpen: (index: number) => void;
};
