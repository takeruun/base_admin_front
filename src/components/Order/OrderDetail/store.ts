import { useState, useContext, ChangeEvent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FontRateContext } from 'src/theme/ThemeProvider';
import { useOrder } from 'src/hooks/useOrder';
import request from 'src/hooks/useRequest';
import { Cache, Complete } from 'src/models/order';
import { Course, Goods } from 'src/models/product';
import { FormInputType } from './types';

export const useOrderDetail = () => {
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();

  const { getOrder, order, loading } = useOrder();
  const [openComplete, setOpenComplete] = useState<boolean>(false);
  const handleOpenComplete = useCallback(() => setOpenComplete(true), []);
  const closeOpenComplete = useCallback(() => setOpenComplete(false), []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      paymentMethod: Cache
    }
  });

  const onSubmit = (data: FormInputType) => {
    try {
      request({
        url: `/v1/orders/${order.id}/status`,
        method: 'PUT',
        reqParams: {
          data: {
            status: Complete,
            paymentMethod: data.paymentMethod
          }
        }
      });
      handleOpenComplete();
    } catch (e) {
      console.error(e);
    }
  };
  const [amountDeposited, setAmountDeposited] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  const handleChangeAmountDeposited = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setAmountDeposited(parseInt(event.target.value));
    setChangeAmount(order.totalPrice - parseInt(event.target.value));
  };

  const handleChangePaymentMethod = (
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (event.target.value != Cache) {
      setAmountDeposited(order.totalPrice);
      setChangeAmount(0);
    }
    setValue('paymentMethod', value);
  };

  const courseItems = order?.orderItems.filter((item) => {
    if (item.product.productType == Course) return item;
  });
  const goodsItems = order?.orderItems.filter((item) => {
    if (item.product.productType == Goods) return item;
  });

  const store = {
    fontRate,
    openComplete,
    order,
    control,
    errors,
    isSubmitting,
    amountDeposited,
    changeAmount,
    courseItems,
    goodsItems,

    closeOpenComplete,
    onSubmit,
    handleSubmit,
    setValue,
    getOrder,
    handleChangeAmountDeposited,
    handleChangePaymentMethod
  };

  return store;
};
