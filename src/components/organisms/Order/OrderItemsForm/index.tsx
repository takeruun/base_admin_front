import { VFC, memo, useEffect } from 'react';
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

import { ProductType, Goods } from 'src/models/product';
import { useOrderItemsForm } from './store';

type OrderItemsProps = {
  productType: ProductType;
  handleCreateOrderItemOpen: (pt: ProductType) => void;
  removeOrderItem?: (orderItemId?: number) => void;
  handleDiscountOpen: (index: number) => void;
  another?: boolean;
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

const OrderItemsForm: VFC<OrderItemsProps> = memo(
  ({
    productType,
    handleCreateOrderItemOpen,
    removeOrderItem,
    handleDiscountOpen,
    another = false
  }) => {
    const { t }: { t: any } = useTranslation();
    const {
      control,

      orderItemSubPrice,
      orderItems,
      getOrderItemIndex,
      productTypeName,
      handleChangeDiscountRate,
      updateOrderItemSubPrice,
      handleChangeQuantity,
      handleRemoveOrderItem
    } = useOrderItemsForm(productType, another);

    useEffect(() => {
      const subscription = updateOrderItemSubPrice();
      return () => subscription.unsubscribe();
    }, [updateOrderItemSubPrice]);

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
              <TableCell align="right" sx={{ width: '10%' }} />
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
                                handleChangeQuantity(
                                  e,
                                  getOrderItemIndex(item.productId)
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
                      render={({ field }) => (
                        <>¥{numeral(field.value).format('0,0')}</>
                      )}
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
                            handleRemoveOrderItem(
                              getOrderItemIndex(item.productId)
                            );
                            if (item?.id) removeOrderItem(item.id);
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
              <TableCell colSpan={2} size="small">
                <Button
                  type="button"
                  size="small"
                  startIcon={<AddTwoToneIcon />}
                  variant="outlined"
                  onClick={() => handleCreateOrderItemOpen(productType)}
                >
                  {t(`${productTypeName()}`)}
                </Button>
              </TableCell>
              <TableCell colSpan={6} align="right" size="small">
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
