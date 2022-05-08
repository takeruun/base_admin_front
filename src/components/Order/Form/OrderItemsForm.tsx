import { FC, FocusEvent, memo, useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Button,
  Tooltip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TableFooter,
  Typography,
  IconButton,
  InputAdornment,
  styled,
  lighten
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import numeral from 'numeral';

import { ProductType, Course, Goods } from 'src/models/product';
import { OrderFormInputType } from './index';

type OrderItemsProps = {
  productType: ProductType;
  handleCreateOrderItemOpen: (pt: ProductType) => void;
  removeOrderItem: (orderItemId?: number) => void;
  handleDiscountOpen: (index: number) => void;
};

const HiddeArrowTextField = styled(TextField)(
  () => `
    input[type=number]:first-of-type::-webkit-inner-spin-button, 
    input[type=number]:first-of-type::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    `
);

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.error.lighter};
    olor: ${theme.colors.error.main};
    padding: ${theme.spacing(0.5)};

    &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
    }
`
);

const OrderItemsForm: FC<OrderItemsProps> = memo(
  ({
    productType,
    handleCreateOrderItemOpen,
    removeOrderItem,
    handleDiscountOpen
  }) => {
    const { t }: { t: any } = useTranslation();
    const { control, setValue, getValues, watch } =
      useFormContext<OrderFormInputType>();
    const { remove } = useFieldArray({
      control,
      name: 'orderItems',
      keyName: 'key'
    });

    const watchOrderItems = watch('orderItems');
    const orderItems = watchOrderItems.filter((field, index) => {
      if (watchOrderItems[index].productType === productType)
        return {
          ...field,
          ...watchOrderItems[index]
        };
    });

    const [orderItemSubPrice, setOrderItemSubPrice] = useState<number>(0);

    const getOrderItemIndex = (productId: number): number =>
      watchOrderItems.findIndex(
        (orderItem) => orderItem.productId === productId
      );

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

    useEffect(() => {
      const subscription = watch((value, { name }) => {
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
      });
      return () => subscription.unsubscribe();
    }, [watch]);

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '35%' }}>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  {t(productType)}
                </Typography>
              </TableCell>
              {productType == Goods && (
                <TableCell>
                  <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                    数量
                  </Typography>
                </TableCell>
              )}
              <TableCell sx={{ width: '10%' }}>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  {t('Price')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '10%' }}>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  {t('Discount rate')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '10%' }}>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  {t('Discount amount')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  {t('Discount type')}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>
                {t('Actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item, index) => {
              return (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    backgroundColor: item.otherPerson ? 'yellow' : ''
                  }}
                >
                  <TableCell padding={'none'}>
                    <Typography noWrap align="center">
                      {item.name}
                    </Typography>
                  </TableCell>
                  {productType == Goods && (
                    <TableCell padding={'none'}>
                      <Typography
                        noWrap
                        align="center"
                        sx={{ width: '60%', mx: 'auto' }}
                      >
                        <Controller
                          control={control}
                          name={`orderItems.${getOrderItemIndex(
                            item.productId
                          )}.quantity`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              onChange={(e) =>
                                setValue(
                                  `orderItems.${getOrderItemIndex(
                                    item.productId
                                  )}.quantity`,
                                  parseInt(e.target.value)
                                )
                              }
                              size="small"
                              type="number"
                              variant="standard"
                              InputProps={{
                                inputProps: {
                                  style: {
                                    padding: 0,
                                    textAlign: 'right'
                                  }
                                }
                              }}
                            />
                          )}
                        />
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell padding={'none'}>
                    <Typography noWrap align="center">
                      ¥{numeral(item.price).format(`0,0`)}
                    </Typography>
                  </TableCell>
                  <TableCell padding={'none'}>
                    <Typography
                      noWrap
                      align="center"
                      sx={{ width: '70%', margin: '0 auto' }}
                    >
                      <Controller
                        control={control}
                        name={`orderItems.${getOrderItemIndex(
                          item.productId
                        )}.discountRate`}
                        render={({ field }) => (
                          <HiddeArrowTextField
                            {...field}
                            size="small"
                            type="number"
                            variant="standard"
                            onBlur={(e) => {
                              handleChangeDiscountRate(
                                e,
                                getOrderItemIndex(item.productId)
                              );
                              field.onBlur();
                            }}
                            InputProps={{
                              inputProps: {
                                style: { padding: 0, textAlign: 'right' }
                              },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography
                                    p={0}
                                    m={0}
                                    variant="body1"
                                    sx={{
                                      lineHeight: 0
                                    }}
                                  >
                                    %
                                  </Typography>
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                      {item.discountRate}%
                    </Typography>
                  </TableCell>
                  <TableCell padding={'none'} align="center">
                    <Controller
                      control={control}
                      name={`orderItems.${getOrderItemIndex(
                        item.productId
                      )}.discountAmount`}
                      render={({ field }) => <>{field.value}</>}
                    />
                  </TableCell>
                  <TableCell padding={'none'} align="center">
                    <Button
                      onClick={() =>
                        handleDiscountOpen(getOrderItemIndex(item.productId))
                      }
                    >
                      <Controller
                        control={control}
                        name={`orderItems.${getOrderItemIndex(
                          item.productId
                        )}.discountName`}
                        render={({ field }) => (
                          <>
                            {field.value?.length > 0 ? field.value : '割引設定'}
                          </>
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Typography noWrap>
                      <Tooltip arrow title={t('Delete')}>
                        <IconButtonError
                          onClick={() => {
                            remove(getOrderItemIndex(item.productId));
                            removeOrderItem(item?.id);
                          }}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButtonError>
                      </Tooltip>
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={0}>
                <Button
                  type="button"
                  startIcon={<AddTwoToneIcon />}
                  variant="outlined"
                  onClick={() => handleCreateOrderItemOpen(productType)}
                >
                  {t(`Add ${productTypeName()} order item`)}
                </Button>
              </TableCell>
              <TableCell colSpan={6} align="right">
                <Typography
                  gutterBottom
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  {t(`${productTypeName()} sub total price`)}:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ¥{numeral(orderItemSubPrice).format(`0,0`)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
);

export default OrderItemsForm;
