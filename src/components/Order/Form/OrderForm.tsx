import { FC, useState, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  CardContent,
  Dialog,
  Grid,
  List,
  ListItem,
  InputAdornment,
  TextField,
  Typography,
  FormControl
} from '@mui/material';

import { styled } from '@mui/material/styles';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { FontRateContext } from 'src/theme/ThemeProvider';
import { Order } from 'src/models/order';
import { ProductType, Course, Goods } from 'src/models/product';
import NumberFormatCustom from 'src/components/NumberFormatCustom';

import DialogSelectSearchOrderItem from './DialogSelectSearchOrderItem';
import DialogSelectSearchDiscount from './DialogSelectSearchDiscount';
import OrderDialogAction from './OrderDialogAction';
import SelectUser from './SelectUser';
import OrderItemsForm from './OrderItemsForm';
import { OrderFormInputType } from './index';

interface OrderFormPropsType {
  removeOrderItem: (orderItemId?: number) => void;
  order?: Order;
}

const FormLabelStyle = styled('p')(
  () => `
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const OrderForm: FC<OrderFormPropsType> = ({ removeOrderItem, order }) => {
  const { t }: { t: any } = useTranslation();
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useFormContext<OrderFormInputType>();

  const [selectProductIds, setSelectProductIds] = useState<number[]>([]);
  const handleAddSelectProductIds = useCallback(
    (productId: number) => setSelectProductIds((prev) => [...prev, productId]),
    []
  );

  const [searchProductType, setSearchProductType] = useState<ProductType>();

  const [orderItemOpen, setOrderItemOpen] = useState<boolean>(false);
  const handleCreateOrderItemOpen = useCallback((pt: ProductType) => {
    setSearchProductType(pt);
    setOrderItemOpen(true);
  }, []);
  const handleCreateOrderItemClose = useCallback(
    () => setOrderItemOpen(false),
    []
  );

  const [discountOrderItem, setDiscountOrderItem] = useState<number>();
  const [discoutOpen, setDiscountOpen] = useState<boolean>(false);
  const handleDiscountOpen = useCallback((index: number) => {
    setDiscountOrderItem(index);
    setDiscountOpen(true);
  }, []);
  const handleDiscountClose = useCallback(() => setDiscountOpen(false), []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      var subTotalPrice = 0;
      if (name.includes('orderItems')) {
        value.orderItems.forEach(
          (orderItem) =>
            (subTotalPrice +=
              (orderItem.price - orderItem.discountAmount) * orderItem.quantity)
        );

        var totalPrice = subTotalPrice;
        setValue('subTotalPrice', subTotalPrice);
        setValue('totalPrice', totalPrice);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    var productIds = [];
    if (Boolean(order)) {
      order.orderItems.forEach((orderItem) => {
        productIds.push(orderItem.productId);
      });
      setSelectProductIds(productIds);
    }
  }, [order]);

  return (
    <CardContent>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                justifyContent: 'flex-start',
                display: 'flex',
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ alignSelf: 'flex-end' }}>
                <SelectUser />
              </Box>
              <Box sx={{ pl: 4 }}>
                <FormControl
                  component="fieldset"
                  sx={{
                    width: '100%'
                  }}
                >
                  <FormLabelStyle sx={{ mb: 0 }}>
                    {t('Date of visit')}
                  </FormLabelStyle>
                  <Controller
                    control={control}
                    name="dateOfVisit"
                    render={({ field }) => (
                      <DesktopDatePicker
                        {...field}
                        inputFormat="yyyy年MM月dd日"
                        mask="____年__月__日"
                        renderInput={(params) => (
                          <TextField
                            {...field}
                            {...params}
                            fullWidth
                            error={Boolean(errors.dateOfVisit)}
                            helperText={errors.dateOfVisit?.message}
                            size="small"
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ px: 2 }}>
                <FormLabelStyle sx={{ mb: 0 }}>
                  {t('Date of visit time')}
                </FormLabelStyle>
                <Controller
                  control={control}
                  name="dateOfVisitTime"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      size="small"
                      fullWidth
                      error={Boolean(errors.dateOfVisitTime)}
                      helperText={errors.dateOfVisitTime?.message}
                    />
                  )}
                />
              </Box>
              <Box>
                <FormLabelStyle sx={{ mb: 0 }}>
                  {t('Date of exit')}
                </FormLabelStyle>
                <Controller
                  control={control}
                  name="dateOfExit"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      size="small"
                      fullWidth
                      error={Boolean(errors.dateOfExit)}
                      helperText={errors.dateOfExit?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <OrderItemsForm
              productType={Course}
              handleCreateOrderItemOpen={handleCreateOrderItemOpen}
              removeOrderItem={removeOrderItem}
              handleDiscountOpen={handleDiscountOpen}
            />
          </Grid>
          <Grid item xs={12}>
            <OrderItemsForm
              productType={Goods}
              handleCreateOrderItemOpen={handleCreateOrderItemOpen}
              removeOrderItem={removeOrderItem}
              handleDiscountOpen={handleDiscountOpen}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <List disablePadding sx={{ width: '40%' }}>
                <ListItem
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    pb: 0
                  }}
                >
                  <Typography
                    fontWeight="normal"
                    sx={{
                      flexBasis: '90%',
                      fontSize: 20 * fontRate
                    }}
                  >
                    {t('Sub total price')}:
                  </Typography>
                  <TextField
                    size="small"
                    value={getValues('subTotalPrice')}
                    sx={{
                      flexBasis: '100%',
                      textAlign: 'right'
                    }}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      inputComponent: NumberFormatCustom as any,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            p={0}
                            m={0}
                            variant="body1"
                            sx={{
                              fontSize: 20 * fontRate,
                              lineHeight: 0
                            }}
                          >
                            円
                          </Typography>
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: {
                          padding: 0,
                          textAlign: 'right',
                          fontSize: 20 * fontRate
                        }
                      }
                    }}
                    variant="standard"
                  />
                </ListItem>
                <ListItem
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    py: 0
                  }}
                >
                  <Typography
                    fontWeight="normal"
                    sx={{
                      flexBasis: '90%',
                      fontSize: 20 * fontRate
                    }}
                  >
                    {t('Discount amount')}:
                  </Typography>
                  <TextField
                    size="small"
                    value={getValues('discountAmount')}
                    sx={{
                      flexBasis: '100%',
                      textAlign: 'right'
                    }}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      inputComponent: NumberFormatCustom as any,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            p={0}
                            m={0}
                            variant="body1"
                            sx={{
                              fontSize: 20 * fontRate,
                              lineHeight: 0
                            }}
                          >
                            円
                          </Typography>
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: {
                          padding: 0,
                          textAlign: 'right',
                          fontSize: 20 * fontRate
                        }
                      }
                    }}
                    variant="standard"
                  />
                </ListItem>
                <ListItem
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    pb: 0
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight="normal"
                    sx={{
                      flexBasis: '90%'
                    }}
                  >
                    {t('Total price')}:
                  </Typography>
                  <TextField
                    size="small"
                    value={getValues('totalPrice')}
                    sx={{
                      flexBasis: '100%',
                      textAlign: 'right'
                    }}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      inputComponent: NumberFormatCustom as any,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            p={0}
                            m={0}
                            variant="h2"
                            sx={{
                              lineHeight: 0
                            }}
                          >
                            円
                          </Typography>
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: {
                          padding: 0,
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: 30 * fontRate
                        }
                      }
                    }}
                    variant="standard"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <OrderDialogAction isSubmitting={isSubmitting} editing={Boolean(order)} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={orderItemOpen}
        onClose={handleCreateOrderItemClose}
      >
        <DialogSelectSearchOrderItem
          handleCreateOrderItemClose={handleCreateOrderItemClose}
          handleAddSelectProductIds={handleAddSelectProductIds}
          intialOrderItemIds={selectProductIds}
          productType={searchProductType}
        />
      </Dialog>
      <DialogSelectSearchDiscount
        open={discoutOpen}
        discountOrderItem={discountOrderItem}
        handleDiscountClose={handleDiscountClose}
      />
    </CardContent>
  );
};

export default OrderForm;
