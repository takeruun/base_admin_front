import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  InputAdornment,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { Course, Goods } from 'src/models/product';
import { useOrder } from 'src/hooks/useOrder';
import { FontRateContext } from 'src/theme/ThemeProvider';
import NumberFormatCustom from 'src/components/NumberFormatCustom';
import OrderItemInfo from './OrderItemInfo';

const LabelTypography = styled('p')(
  () => `
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const OrderInfo = () => {
  const { t }: { t: any } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, order, loading } = useOrder();
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();

  const courseItems = order?.orderItems.filter((item) => {
    if (item.product.productType == 'コース') return item;
  });
  const goodsItems = order?.orderItems.filter((item) => {
    if (item.product.productType == '商品') return item;
  });

  useEffect(() => {
    getOrder(parseInt(orderId));
  }, []);

  return (
    <>
      {!loading && order && (
        <Card>
          <CardHeader title={t('Order info')} />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    flexWrap: 'wrap'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography noWrap variant="subtitle2">
                      {order.customer.familyNameKana}
                      {order.customer.givenNameKana}
                    </Typography>
                    <Typography
                      noWrap
                      variant="h3"
                      sx={{ textDecoration: 'underline' }}
                    >
                      {order.customer.familyName}
                      {order.customer.givenName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      pl: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <LabelTypography sx={{ mb: 0 }}>
                      {t('Date of visit')}
                    </LabelTypography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 23 * fontRate,
                        position: 'relative',
                        bottom: 0
                      }}
                    >
                      {format(new Date(order.dateOfVisit), 'yyyy年M月d日')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      pl: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <LabelTypography sx={{ mb: 0 }}>
                      {t('Date of visit time')}
                    </LabelTypography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 23 * fontRate,
                        position: 'relative',
                        bottom: 0
                      }}
                    >
                      {format(new Date(order.dateOfVisit), 'HH:mm')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      pl: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <LabelTypography sx={{ mb: 0 }}>
                      {t('Date of exit')}
                    </LabelTypography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 23 * fontRate,
                        position: 'relative',
                        bottom: 0
                      }}
                    >
                      {format(new Date(order.dateOfExit), 'HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <OrderItemInfo productType={Course} orderItems={courseItems} />
              </Grid>
              <Grid item xs={12}>
                <OrderItemInfo productType={Goods} orderItems={goodsItems} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 3,
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
                      value={order.subTotalPrice}
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
                      value={order.discountAmount}
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
                      value={order.totalPrice}
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 3
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigate(`/dashboards/orders/edit/${order.id}`)
                  }
                >
                  {t('To edit order')}
                </Button>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default OrderInfo;
