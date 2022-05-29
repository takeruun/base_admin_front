import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useOrderFormState,
  useOrderFormDispatch,
  handleReservationAnother
} from 'src/contexts/OrderFormContext';
import { Product, ProductType } from 'src/models/product';
import { Discount, Percentage, PriceReduction } from 'src/models/discount';
import { ReservationAnotherInputType } from './types';

export const useReservationAnother = (index: number) => {
  const { t }: { t: any } = useTranslation();
  const { reservationAnotherOpens } = useOrderFormState();
  const dispatchOrderForm = useOrderFormDispatch();

  const schema = Yup.object({
    customerId: Yup.number().required(t('You must select a customer.')),
    dateOfVisit: Yup.string().required(t('Date of visit is required.')),
    dateOfVisitTime: Yup.string().required(
      t('Date of visit time is required.')
    ),
    dateOfExit: Yup.string().required(t('Date of exit is required.')),
    orderItems: Yup.array(
      Yup.object().shape({
        productId: Yup.number().required(t('Need select product.'))
      })
    ),
    customer: Yup.object().shape({
      familyName: Yup.string().required(t('Family name is required.')),
      givenName: Yup.string().required(t('Given name is required.')),
      familyNameKana: Yup.string().required(t('Family name kana is required.')),
      givenNameKana: Yup.string().required(t('Given name kana is required.')),
      postalCode: Yup.string().required(t('Postal code is required.')),
      prefecture: Yup.string().required(t('Need select prefecure.')),
      address1: Yup.string().required(t('Municipalities is required.')),
      address2: Yup.string().required(t('House number is required.')),
      phoneNumber: Yup.string().required(t('Phone number is required.')),
      email: Yup.string().required(t('Email is required.'))
    })
  }).required();

  const methods = useForm<ReservationAnotherInputType>({
    defaultValues: {
      customerId: 0,
      dateOfVisit: '',
      dateOfVisitTime: '',
      dateOfExit: '',
      orderItems: [],
      status: '予約',
      paymentMethod: '未設定',
      discountAmount: 0,
      subTotalPrice: 0,
      totalPrice: 0
    },
    resolver: yupResolver(schema)
  });

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = methods;
  const { append } = useFieldArray({
    control,
    name: 'orderItems',
    keyName: 'key'
  });

  const [selectProductIds, setSelectProductIds] = useState<number[]>([]);
  const [searchProductType, setSearchProductType] = useState<ProductType>();
  const [orderItemOpen, setOrderItemOpen] = useState(false);
  const handleCreateOrderItemOpen = useCallback((pt: ProductType) => {
    setSearchProductType(pt);
    setOrderItemOpen(true);
  }, []);
  const handleCreateOrderItemClose = useCallback(
    () => setOrderItemOpen(false),
    []
  );
  const [discountOrderItem, setDiscountOrderItem] = useState(0);
  const [discoutOpen, setDiscountOpen] = useState(false);

  const handleDiscountOpen = useCallback((index: number) => {
    setDiscountOrderItem(index);
    setDiscountOpen(true);
  }, []);
  const handleDiscountClose = useCallback(() => setDiscountOpen(false), []);

  const updateOrderPrice = useCallback(
    () =>
      watch((value, { name }) => {
        var subTotalPrice = 0;
        if (name.includes('orderItems')) {
          value.orderItems.forEach(
            (orderItem) =>
              (subTotalPrice +=
                (orderItem.price - orderItem.discountAmount) *
                orderItem.quantity)
          );

          var totalPrice = subTotalPrice;
          setValue('subTotalPrice', subTotalPrice);
          setValue('totalPrice', totalPrice);
        }
      }),
    [watch]
  );

  const updateSelectProductIds = useCallback(
    () =>
      watch((value, { name }) => {
        if (name.includes('orderItems')) {
          setSelectProductIds(
            value.orderItems.map((orderItem) => orderItem.productId)
          );
        }
      }),
    [watch]
  );

  const selectDiscount = (discountOrderItem: number, discount: Discount) => {
    const price = getValues(`orderItems.${discountOrderItem}.price`);
    var newPrice = 0;
    if (discount.discountType == Percentage) {
      setValue(`orderItems.${discountOrderItem}.discountRate`, discount.amount);
      newPrice = price * ((100 - discount.amount) / 100);
    } else if (discount.discountType == PriceReduction) {
      newPrice = price - discount.amount;
    }

    setValue(`orderItems.${discountOrderItem}.discountId`, discount.id);
    setValue(
      `orderItems.${discountOrderItem}.discountAmount`,
      price - newPrice
    );
    setValue(`orderItems.${discountOrderItem}.discountName`, discount.name);
  };

  const addOrderItem = useCallback((product: Product) => {
    append({
      name: product.name,
      productId: product.id,
      price: product.price,
      taxRate: 10,
      quantity: 1,
      otherPerson: false,
      productType: product.productType,
      discountAmount: 0,
      discountRate: 0
    });
  }, []);

  const expand = reservationAnotherOpens.find(
    (reservation) => reservation.index === index
  ).open;

  const handleExpand = useCallback(
    () => dispatchOrderForm(handleReservationAnother(index, !expand)),
    [expand]
  );

  const store = {
    methods,
    control,
    getValues,
    errors,
    isSubmitting,
    expand,

    selectProductIds,
    searchProductType,
    orderItemOpen,
    discountOrderItem,
    discoutOpen,

    handleExpand,
    handleCreateOrderItemOpen,
    handleCreateOrderItemClose,
    handleDiscountOpen,
    handleDiscountClose,
    updateOrderPrice,
    updateSelectProductIds,
    selectDiscount,
    addOrderItem
  };

  return store;
};
