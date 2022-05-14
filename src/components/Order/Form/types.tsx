import { ProductType } from 'src/models/product';
import { Order, PaymentMethod, Status } from 'src/models/order';

export type OrderItemFormInputType = {
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

export type CustomerFormInputType = {
  id?: number | null;
  familyName: string;
  givenName: string;
  familyNameKana: string;
  givenNameKana: string;
  postalCode: string;
  prefecture: string;
  address1: string;
  address2: string;
  address3: string;
  phoneNumber: string;
  homePhoneNumber: string;
  email: string;
  gender: number;
  birthday: string;
  occupation: string;
  firstVisitDate: string;
  familyUserId: number;
  familyRelationship: number;
  memo: string;
};

export type OrderFormInputType = {
  userId: number;
  dateOfVisit: string;
  dateOfVisitTime: string;
  dateOfExit: string;
  orderItems: OrderItemFormInputType[];
  status: Status;
  paymentMethod: PaymentMethod;
  discountAmount: number;
  subTotalPrice: number;
  totalPrice: number;
  user: CustomerFormInputType;
};

export type SelectSearchOrderItemFormInputType = {
  categoryId: number;
  name: string;
};
