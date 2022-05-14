import { OrderItem } from './orderItem';
import { Customer } from './customer';

export type Status = '予約' | '完了' | 'キャンセル';
export type PaymentMethod = 'クレジットカード' | 'PayPay' | '現金' | '未設定';

export const Resarvation = '予約';
export const Complete = '完了';
export const Cancel = 'キャンセル';

export const statuses = [
  {
    value: 1,
    label: 'Resarvation'
  },
  {
    value: 2,
    label: 'Complete'
  },
  {
    value: 3,
    label: 'Cancel'
  }
];

export const CreditCard = 'クレジットカード';
export const Paypay = 'Paypay';
export const Cache = '現金';

export const paymentMethods = [CreditCard, Paypay, Cache];

export interface Order {
  id: number;
  customerId: number;
  status: Status;
  dateOfVisit: string;
  dateOfExit: string;
  subTotalPrice: number;
  totalPrice: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  orderItems: OrderItem[];
  taxRate: number;
  customer: Customer;
}
