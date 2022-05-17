import { useEffect, useState, useContext, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  CardContent,
  DialogActions,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TextField,
  List,
  ListItem,
  InputAdornment,
  styled
} from '@mui/material';
import { format } from 'date-fns';
import numeral from 'numeral';
import AlertDialog from 'src/components/molecule/AlertDialog';
import request from 'src/hooks/useRequest';
import { paymentMethods, Cache, Complete } from 'src/models/order';
import { Course, Goods } from 'src/models/product';
import { FontRateContext } from 'src/theme/ThemeProvider';
import NumberFormatCustom from 'src/components/NumberFormatCustom';
import { useOrder } from 'src/hooks/useOrder';

const UnderLineTypography = styled(Typography)(
  () => `
    text-decoration: underline;
`
);

const FormLabelStyle = styled('p')(
  () => `
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: bold;
  `
);

type FormInputType = {
  paymentMethod: string;
};

const OrderDetail = () => {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();
  const { getOrder, order, loading } = useOrder();

  const [openComplete, setOpenComplete] = useState<boolean>(false);
  const handleOpenComplete = () => setOpenComplete(true);
  const closeOpenComplete = () => setOpenComplete(false);

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

  useEffect(() => {
    getOrder(parseInt(orderId));
  }, []);

  useEffect(() => {
    if (order) setValue('paymentMethod', order.paymentMethod);
  }, [order]);

  return (
    <>
      <Card>
        {order && (
          <>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      sx={{ justifyContent: 'space-between', display: 'flex' }}
                    >
                      <Box
                        sx={{
                          alignItems: 'flex-end',
                          display: 'flex',
                          flexWrap: 'wrap'
                        }}
                      >
                        <Box>
                          <Typography
                            noWrap
                            variant="subtitle2"
                            sx={{ mb: '-3px' }}
                          >
                            {order.customer.familyNameKana}{' '}
                            {order.customer.givenNameKana}
                          </Typography>
                          <UnderLineTypography noWrap variant="h3">
                            {order.customer.familyName}{' '}
                            {order.customer.givenName}
                          </UnderLineTypography>
                        </Box>
                        <Box sx={{ pl: 4 }}>
                          <FormLabelStyle sx={{ mb: 0 }}>
                            {t('Date of visit')}
                          </FormLabelStyle>
                          <Typography noWrap variant="h3">
                            {format(new Date(order.dateOfVisit), 'yyyy/MM/dd')}
                          </Typography>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                          <FormLabelStyle sx={{ mb: 0 }}>
                            {t('Date of visit time')}
                          </FormLabelStyle>
                          <Typography noWrap variant="h3">
                            {format(new Date(order.dateOfVisit), 'HH:mm')}
                          </Typography>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                          <FormLabelStyle sx={{ mb: 0 }}>
                            {t('Date of exit')}
                          </FormLabelStyle>
                          <Typography noWrap variant="h3">
                            {format(new Date(order.dateOfExit), 'HH:mm')}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>担当者：</Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '40%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Course')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '10%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Price')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '10%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Tax rate')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Discount amount')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Discount type')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {courseItems.length > 0 && (
                          <TableBody>
                            {courseItems.map((item, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.product.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      ¥{numeral(item.price).format(`0,0`)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.taxRate}%
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.discountAmount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        )}
                      </Table>
                      {courseItems.length == 0 && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ pt: 2 }}>なし</Typography>
                        </Box>
                      )}
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '40%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Goods')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '10%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Price')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '10%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Tax rate')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Discount amount')}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                {t('Discount type')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {goodsItems.length > 0 && (
                          <TableBody>
                            {goodsItems.map((item, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.product.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      ¥{numeral(item.price).format(`0,0`)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.taxRate}%
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      {item.discountAmount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        )}
                      </Table>
                      {goodsItems.length == 0 && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ pt: 2 }}>なし</Typography>
                        </Box>
                      )}
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={6}>
                      <FormLabelStyle>{t('Payment method')}</FormLabelStyle>
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={paymentMethods}
                            onChange={handleChangePaymentMethod}
                            renderInput={(params) => (
                              <TextField
                                error={Boolean(errors.paymentMethod)}
                                helperText={errors.paymentMethod?.message}
                                fullWidth
                                {...params}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <List disablePadding sx={{ width: '50%' }}>
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
                              flexGrow: 0,
                              maxWidth: '100%',
                              flexBasis: '90%',
                              fontSize: 20 * fontRate
                            }}
                          >
                            {t('Sub total price')}:
                          </Typography>
                          <TextField
                            size="small"
                            value={order.subTotalPrice}
                            sx={{
                              flexGrow: 1,
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
                              flexGrow: 0,
                              maxWidth: '100%',
                              flexBasis: '90%',
                              fontSize: 20 * fontRate
                            }}
                          >
                            {t('Discount amount')}:
                          </Typography>
                          <TextField
                            size="small"
                            value={order.discountAmount}
                            sx={{
                              flexGrow: 1,
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
                              flexGrow: 0,
                              maxWidth: '100%',
                              flexBasis: '90%'
                            }}
                          >
                            {t('Total price')}:
                          </Typography>
                          <TextField
                            size="small"
                            value={order.totalPrice}
                            sx={{
                              flexGrow: 1,
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
                        <ListItem
                          sx={{
                            justifyContent: 'space-between',
                            display: 'flex',
                            pt: 0
                          }}
                        >
                          <Typography
                            variant="h3"
                            fontWeight="normal"
                            sx={{
                              flexGrow: 0,
                              maxWidth: '100%',
                              flexBasis: '90%'
                            }}
                          >
                            {t('Amount deposited')}:
                          </Typography>
                          <TextField
                            size="small"
                            sx={{
                              flexGrow: 1,
                              flexBasis: '100%',
                              textAlign: 'right'
                            }}
                            value={amountDeposited}
                            onChange={handleChangeAmountDeposited}
                            InputProps={{
                              inputComponent: NumberFormatCustom as any,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography
                                    p={0}
                                    m={0}
                                    variant="body1"
                                    sx={{
                                      fontSize: 30 * fontRate,
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
                                  fontSize: 30 * fontRate
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
                              flexGrow: 0,
                              maxWidth: '100%',
                              flexBasis: '90%'
                            }}
                          >
                            {t('Change amount')}:
                          </Typography>
                          <TextField
                            size="small"
                            sx={{
                              flexGrow: 1,
                              flexBasis: '100%',
                              textAlign: 'right'
                            }}
                            value={changeAmount}
                            InputProps={{
                              readOnly: true,
                              inputComponent: NumberFormatCustom as any,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography
                                    p={0}
                                    m={0}
                                    variant="body1"
                                    sx={{
                                      fontSize: 30 * fontRate,
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
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  <Button color="secondary">{t('Cancel')}</Button>
                  <Button
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {t('Complete')}
                  </Button>
                </DialogActions>
              </form>
            </CardContent>
            <AlertDialog
              open={openComplete}
              onClose={closeOpenComplete}
              handleAlertDone={() =>
                navigate(`/dashboards/orders/receipt/${order.id}`)
              }
              mode={'success'}
              alertMainMessage={t('Payment has been completed')}
              alertButtomMessage={t('To receipt page')}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default OrderDetail;
