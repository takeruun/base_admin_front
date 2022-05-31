import { useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { format } from 'date-fns';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  useOrderFormState,
  useOrderFormDispatch,
  addRemoveOrderItemId,
  setCustomerId,
  reset
} from 'src/contexts/OrderFormContext';
import { Product, ProductType } from 'src/models/product';
import type { Order } from 'src/models/order';
import type { Customer } from 'src/models/customer';
import { Discount, Percentage, PriceReduction } from 'src/models/discount';
import { useCustomer } from 'src/hooks/useCustomer';
import request from 'src/hooks/useRequest';
import { usePrefectures } from 'src/hooks/usePrefectures';
import { useOccupations } from 'src/hooks/useOccupations';
import { usePagination } from 'src/hooks/usePagination';
import { OrderFormInputType } from './types';

export const useOrderIndexForm = (orderId?: number) => {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();
  const { removeOrderItemIds } = useOrderFormState();
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

  const methods = useForm<OrderFormInputType>({
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
      totalPrice: 0,
      customer: {
        familyName: '',
        givenName: '',
        familyNameKana: '',
        givenNameKana: '',
        postalCode: '',
        prefecture: '',
        address1: '',
        address2: '',
        address3: '',
        phoneNumber: '',
        homePhoneNumber: '',
        email: '',
        gender: 0,
        birthday: '',
        occupation: '',
        firstVisitDate: '',
        familyUserId: 0,
        familyRelationship: 0,
        memo: ''
      }
    },
    resolver: yupResolver(schema)
  });
  const { setValue } = methods;

  const onSubmit = async (data: OrderFormInputType) => {
    const dateOfVisit = new Date(
      data.dateOfVisit.replace('年', '-').replace('月', '-').replace('日', '')
    );

    if (removeOrderItemIds.length > 0)
      await request({
        url: '/v1/order_items',
        method: 'DELETE',
        reqParams: {
          params: {
            ids: removeOrderItemIds
          }
        }
      });

    request({
      url: Boolean(orderId) ? `/v1/orders/${orderId}` : '/v1/orders',
      method: Boolean(orderId) ? 'PUT' : 'POST',
      reqParams: {
        data: {
          ...data,
          dateOfVisit: new Date(
            `${format(dateOfVisit, 'yyyy-MM-dd')} ${data.dateOfVisitTime}`
          ),
          dateOfExit: new Date(
            `${format(dateOfVisit, 'yyyy-MM-dd')} ${data.dateOfExit}`
          )
        }
      }
    }).then(() => {
      navigate('/dashboards/orders');
    });
  };

  const [orderExpand, setOrderExpand] = useState(true);
  const handleOrderExpand = useCallback(
    () => setOrderExpand((prev) => !prev),
    []
  );

  const [userExpand, setUserExpand] = useState(false);
  const handleUserExpand = useCallback(
    () => setUserExpand((prev) => !prev),
    []
  );

  const setOrder = useCallback((order?: Order) => {
    if (Boolean(order)) {
      const orderItems = order.orderItems.map((oi) => {
        return {
          id: oi.id,
          key: oi.id,
          name: oi.product.name,
          productId: oi.productId,
          price: oi.price,
          quantity: oi.quantity,
          taxRate: oi.taxRate,
          otherPerson: oi.otherPerson,
          productType: oi.product.productType,
          discountId: oi.discountId,
          discountAmount: oi.discountAmount,
          discountRate: oi.discountRate,
          discountName: oi.discount.name
        };
      });
      dispatchOrderForm(setCustomerId(order.customerId));
      setValue('customerId', order.customerId);
      setValue('dateOfVisit', order.dateOfVisit);
      setValue('dateOfVisitTime', format(new Date(order.dateOfVisit), 'HH:mm'));
      setValue('dateOfExit', format(new Date(order.dateOfExit), 'HH:mm'));
      setValue('status', order.status);
      setValue('orderItems', orderItems);
      setValue('paymentMethod', order.paymentMethod);

      setValue('customer.id', order.customer.id);
      setValue('customer.familyName', order.customer.familyName);
      setValue('customer.givenName', order.customer.givenName);
      setValue('customer.familyNameKana', order.customer.familyNameKana);
      setValue('customer.givenNameKana', order.customer.givenNameKana);
      setValue('customer.postalCode', order.customer.postalCode);
      setValue('customer.prefecture', order.customer.prefecture);
      setValue('customer.address1', order.customer.address1);
      setValue('customer.address2', order.customer.address2);
      setValue('customer.address3', order.customer.address3);
      setValue('customer.phoneNumber', order.customer.phoneNumber);
      setValue('customer.homePhoneNumber', order.customer.homePhoneNumber);
      setValue('customer.email', order.customer.email);
      setValue('customer.gender', order.customer.gender);
      setValue('customer.birthday', order.customer.birthday);
      setValue('customer.occupation', order.customer.occupation);
      setValue('customer.firstVisitDate', order.customer.firstVisitDate);
      setValue('customer.memo', order.customer.memo ? order.customer.memo : '');
    }
  }, []);

  const execReset = () => dispatchOrderForm(reset());

  const store = {
    methods,
    orderExpand,
    userExpand,
    onSubmit,
    handleOrderExpand,
    handleUserExpand,
    setOrder,
    execReset
  };

  return store;
};

export const useOrderForm = () => {
  const { control, getValues, setValue, watch, formState } =
    useFormContext<OrderFormInputType>();
  const { append } = useFieldArray({
    control,
    name: 'orderItems',
    keyName: 'key'
  });

  const { reservationAnotherOpens } = useOrderFormState();
  const dispatchOrderForm = useOrderFormDispatch();
  const [selectProductIds, setSelectProductIds] = useState<number[]>([]);

  const setInitialSelectProductIds = useCallback((order?: Order) => {
    if (Boolean(order)) {
      var productIds = [];
      order.orderItems.forEach((orderItem) => {
        productIds.push(orderItem.productId);
      });
      setSelectProductIds(productIds);
    }
  }, []);

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

  const handleAddRemoveOrderItemId = useCallback(
    (id: number) => dispatchOrderForm(addRemoveOrderItemId(id)),
    []
  );

  const store = {
    control,
    getValues,
    formState,

    selectProductIds,
    searchProductType,
    orderItemOpen,
    discountOrderItem,
    discoutOpen,
    reservationAnotherOpens,

    setInitialSelectProductIds,
    handleCreateOrderItemOpen,
    handleCreateOrderItemClose,
    handleDiscountOpen,
    handleDiscountClose,
    updateOrderPrice,
    updateSelectProductIds,
    selectDiscount,
    addOrderItem,
    handleAddRemoveOrderItemId
  };

  return store;
};

export const useSelectCustomer = () => {
  const { setValue, getValues } = useFormContext<OrderFormInputType>();
  const dispatchOrderForm = useOrderFormDispatch();
  const { customers, totalCustomerCount, getCustomers } = useCustomer();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState(null);

  const handleSetFromValue = (value: string) => setFormValue(value);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectCustomer = (customer: Customer) => {
    dispatchOrderForm(setCustomerId(customer.id));
    setValue('customerId', customer.id);
    setValue('customer.id', customer.id);
    setValue('customer.familyName', customer.familyName);
    setValue('customer.givenName', customer.givenName);
    setValue('customer.familyNameKana', customer.familyNameKana);
    setValue('customer.givenNameKana', customer.givenNameKana);
    setValue('customer.postalCode', customer.postalCode);
    setValue('customer.prefecture', customer.prefecture);
    setValue('customer.address1', customer.address1);
    setValue('customer.address2', customer.address2);
    setValue('customer.address3', customer.address3);
    setValue('customer.phoneNumber', customer.phoneNumber);
    setValue('customer.homePhoneNumber', customer.homePhoneNumber);
    setValue('customer.email', customer.email);
    setValue('customer.gender', customer.gender);
    setValue('customer.birthday', customer.birthday);
    setValue('customer.occupation', customer.occupation);
    setValue('customer.firstVisitDate', customer.firstVisitDate);
    setValue('customer.memo', customer.memo ? customer.memo : '');
  };

  const store = {
    getValues,
    open,
    formValue,
    page,
    limit,
    customers,
    totalCustomerCount,

    getCustomers,
    handleSetFromValue,
    handleOpen,
    handleClose,
    handleSelectCustomer,
    handlePageChange,
    handleLimitChange
  };

  return store;
};

export const useCustomerForm = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<OrderFormInputType>();

  const { getPrefectures, prefectures } = usePrefectures();
  const { getOccupations, occupations } = useOccupations();

  const updateAddress = useCallback(
    () =>
      watch((value, { name, type }) => {
        if (
          name === 'customer.postalCode' &&
          value.customer.postalCode.length >= 7
        ) {
          axios
            .get('https://zipcloud.ibsnet.co.jp/api/search', {
              params: {
                zipcode: value.customer.postalCode
              }
            })
            .then((res) => {
              if (res['data']['results']) {
                setValue(
                  'customer.prefecture',
                  res['data']['results'][0]['address1']
                );
                setValue(
                  'customer.address1',
                  res['data']['results'][0]['address2']
                );
                setValue(
                  'customer.address2',
                  res['data']['results'][0]['address3']
                );
              }
            });
        }
      }),
    [watch]
  );

  const store = {
    control,
    setValue,
    formState: { errors },

    prefectures,
    occupations,

    getPrefectures,
    getOccupations,
    updateAddress
  };

  return store;
};