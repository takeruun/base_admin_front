import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardHeader, Collapse, Divider } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { format } from 'date-fns';

import { Order, PaymentMethod, Status } from 'src/models/order';
import { ProductType } from 'src/models/product';
import request from 'src/hooks/useRequest';

import UserForm from './UserForm';
import OrderForm from './OrderForm';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

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

export type UserFormInputType = {
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
  user: UserFormInputType;
};

const Form: FC<{ order?: Order }> = ({ order }) => {
  const navigate = useNavigate();
  const { t }: { t: any } = useTranslation();

  const schema = Yup.object({
    userId: Yup.number().required(t('You must select a customer.')),
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
    user: Yup.object().shape({
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
      userId: 0,
      dateOfVisit: '',
      dateOfVisitTime: '',
      dateOfExit: '',
      orderItems: [],
      status: '予約',
      paymentMethod: '未設定',
      discountAmount: 0,
      subTotalPrice: 0,
      totalPrice: 0,
      user: {
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
  const { setValue, handleSubmit } = methods;

  const [removeOrderItemId, setRemoveOrderItemId] = useState<number[]>([]);
  const removeOrderItem = useCallback((orderItemId?: number) => {
    if (orderItemId) setRemoveOrderItemId((prev) => [...prev, orderItemId]);
  }, []);

  const onSubmit = async (data: OrderFormInputType) => {
    const dateOfVisit = new Date(
      data.dateOfVisit.replace('年', '-').replace('月', '-').replace('日', '')
    );

    if (removeOrderItemId.length > 0)
      await request({
        url: '/v1/order_items',
        method: 'DELETE',
        reqParams: {
          params: {
            ids: removeOrderItemId
          }
        }
      });

    request({
      url: Boolean(order) ? `/v1/orders/${order.id}` : '/v1/orders',
      method: Boolean(order) ? 'PUT' : 'POST',
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

  useEffect(() => {
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

      setValue('userId', order.userId);
      setValue('dateOfVisit', order.dateOfVisit);
      setValue('dateOfVisitTime', format(new Date(order.dateOfVisit), 'HH:mm'));
      setValue('dateOfExit', format(new Date(order.dateOfExit), 'HH:mm'));
      setValue('status', order.status);
      setValue('orderItems', orderItems);
      setValue('paymentMethod', order.paymentMethod);

      setValue('user.id', order.user.id);
      setValue('user.familyName', order.user.familyName);
      setValue('user.givenName', order.user.givenName);
      setValue('user.familyNameKana', order.user.familyNameKana);
      setValue('user.givenNameKana', order.user.givenNameKana);
      setValue('user.postalCode', order.user.postalCode);
      setValue('user.prefecture', order.user.prefecture);
      setValue('user.address1', order.user.address1);
      setValue('user.address2', order.user.address2);
      setValue('user.address3', order.user.address3);
      setValue('user.phoneNumber', order.user.phoneNumber);
      setValue('user.homePhoneNumber', order.user.homePhoneNumber);
      setValue('user.email', order.user.email);
      setValue('user.gender', order.user.gender);
      setValue('user.birthday', order.user.birthday);
      setValue('user.occupation', order.user.occupation);
      setValue('user.firstVisitDate', order.user.firstVisitDate);
      setValue('user.memo', order.user.memo ? order.user.memo : '');
    }
  }, [order]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader
              title={t('Customer info')}
              action={
                <ExpandMore
                  expand={userExpand}
                  onClick={handleUserExpand}
                  aria-expanded={userExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Divider />
            <Collapse in={userExpand} timeout="auto" unmountOnExit>
              <UserForm />
            </Collapse>
          </Card>
          <Card
            sx={{
              mt: 3
            }}
          >
            <CardHeader
              title={t('Order info')}
              action={
                <ExpandMore
                  expand={orderExpand}
                  onClick={handleOrderExpand}
                  aria-expanded={orderExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Divider />
            <Collapse in={orderExpand} timeout="auto" unmountOnExit>
              <OrderForm removeOrderItem={removeOrderItem} order={order} />
            </Collapse>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

export default Form;
