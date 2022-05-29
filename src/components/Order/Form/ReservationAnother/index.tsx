import { VFC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  CardContent,
  Collapse,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandMore from 'src/components/molecule/ExpandMore';
import { FontRateContext } from 'src/theme/ThemeProvider';
import NumberFormatCustom from 'src/components/molecule/NumberFormatCustom';
import { Course, Goods } from 'src/models/product';
import ReservationAnotherItemsForm from './ReservationAnotherItemsForm';
import DialogSelectSearchOrderItem from './DialogSelectSearchOrderItem';
import DialogSelectSearchDiscount from './DialogSelectSearchDiscount';

import { useReservationAnother } from './store';

const FormLabelStyle = styled('p')(
  () => `
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const ReservationAnother: VFC<{ index: number }> = ({ index }) => {
  const { t }: { t: any } = useTranslation();
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();
  const {
    methods,
    getValues,
    control,
    errors,
    searchProductType,
    orderItemOpen,
    discountOrderItem,
    discoutOpen,
    expand,

    handleExpand,
    handleCreateOrderItemOpen,
    handleCreateOrderItemClose,
    handleDiscountOpen,
    handleDiscountClose,
    updateOrderPrice,
    updateSelectProductIds
  } = useReservationAnother(index);

  useEffect(() => {
    const subscription = updateOrderPrice();
    return () => subscription.unsubscribe();
  }, [updateOrderPrice]);

  useEffect(() => {
    const subscription = updateSelectProductIds();
    return () => subscription.unsubscribe();
  }, [updateSelectProductIds]);

  return (
    <FormProvider {...methods}>
      <CardContent
        sx={{
          borderTop: '2px dotted grey',
          borderBottom: '2px dotted grey',
          p: 1,
          '&:last-child': { pb: 0 }
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                justifyContent: 'flex-start',
                display: 'flex',
                flexWrap: 'wrap'
              }}
            >
              <Box>
                <ExpandMore
                  expand={expand}
                  onClick={handleExpand}
                  aria-expanded={expand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
              <Box sx={{ pl: 1 }}>
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
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Grid item xs={8}>
                  <ReservationAnotherItemsForm
                    productType={Course}
                    handleCreateOrderItemOpen={handleCreateOrderItemOpen}
                    handleDiscountOpen={handleDiscountOpen}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <ReservationAnotherItemsForm
                    productType={Goods}
                    handleCreateOrderItemOpen={handleCreateOrderItemOpen}
                    handleDiscountOpen={handleDiscountOpen}
                  />
                  <Box
                    sx={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      display: 'flex',
                      width: '50%'
                    }}
                  >
                    <List disablePadding>
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
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </CardContent>
      <Dialog
        fullWidth
        maxWidth="md"
        open={orderItemOpen}
        onClose={handleCreateOrderItemClose}
      >
        <DialogSelectSearchOrderItem
          handleCreateOrderItemClose={handleCreateOrderItemClose}
          productType={searchProductType}
        />
      </Dialog>
      <DialogSelectSearchDiscount
        open={discoutOpen}
        discountOrderItem={discountOrderItem}
        handleDiscountClose={handleDiscountClose}
      />
    </FormProvider>
  );
};

export default ReservationAnother;
