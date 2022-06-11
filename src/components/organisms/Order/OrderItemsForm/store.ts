import { useState, FocusEvent, useCallback, ChangeEvent } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { ProductType, Course, Goods } from 'src/models/product';
import { OrderFormInputType } from './types';

export const useOrderItemsForm = (
  productType: ProductType,
) => {
  const { control, setValue, getValues, watch } = useFormContext<OrderFormInputType>();
  const { remove } = useFieldArray({
    control,
    name: 'orderItems',
    keyName: 'key'
  });

  const watchOrderItems = watch('orderItems');
  const getOrderItems = useCallback(
    () =>
      watchOrderItems.filter((field, index) => {
        if (watchOrderItems[index].productType === productType)
          return {
            ...field,
            ...watchOrderItems[index]
          };
      }),
    [watchOrderItems]
  );
  const orderItems = getOrderItems();

  const [orderItemSubPrice, setOrderItemSubPrice] = useState(0);

  const getOrderItemIndex = (productId: number): number =>
    watchOrderItems.findIndex((orderItem) => orderItem.productId === productId);

  const productTypeName = (): string => {
    if (productType == Course) return 'Course';
    else if (productType == Goods) return 'Goods';
    else return 'Other';
  };

  const handleChangeDiscountRate = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    orderItemIndex: number
  ) => {
    const price = getValues(`orderItems.${orderItemIndex}.price`);
    setValue(
      `orderItems.${orderItemIndex}.discountAmount`,
      price - price * ((100 - parseInt(event.target.value)) / 100)
    );
    setValue(
      `orderItems.${orderItemIndex}.discountRate`,
      parseInt(event.target.value)
    );
  };

  const updateOrderItemSubPrice = useCallback(
    () =>
      watch((value, { name }) => {
        if (name.includes('orderItems')) {
          var orderItemSubPrice = 0;
          value.orderItems.map((orderItem) => {
            if (orderItem.productType === productType) {
              orderItemSubPrice +=
                (orderItem.price - orderItem.discountAmount) *
                orderItem.quantity;
            }
          });
          setOrderItemSubPrice(orderItemSubPrice);
        }
      }),
    [watch]
  );

  const handleChangeQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    orderItemIndex: number
  ) =>
    setValue(`orderItems.${orderItemIndex}.quantity`, parseInt(e.target.value));

  const handleRemoveOrderItem = (orderItemIndex: number) =>
    remove(orderItemIndex);

  const store = {
    control,

    orderItemSubPrice,
    orderItems,
    getOrderItemIndex,
    productTypeName,
    handleChangeDiscountRate,
    updateOrderItemSubPrice,
    handleChangeQuantity,
    handleRemoveOrderItem
  };

  return store;
};
