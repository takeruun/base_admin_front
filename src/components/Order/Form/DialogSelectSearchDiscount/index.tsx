import { useState, useEffect, ChangeEvent, FC, memo } from 'react';
import {
  useFormContext,
  UseFormSetValue,
  UseFormGetValues
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  InputAdornment,
  DialogTitle,
  TablePagination
} from '@mui/material';
import numeral from 'numeral';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

import { useAllDiscounts } from 'src/hooks/useDiscount';
import { Discount, Percentage, PriceReduction } from 'src/models/discount';
import type { OrderFormInputType } from '..';

type DialogSelectSearchDiscountProps = {
  open: boolean;
  discountOrderItem: number;
  handleDiscountClose: () => void;
};

const DialogSelectSearchDiscount: FC<DialogSelectSearchDiscountProps> = memo(
  ({ open, discountOrderItem, handleDiscountClose }) => {
    const { t }: { t: any } = useTranslation();
    const [formValue, setFormValue] = useState(null);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const { getDiscounts, totalCount, discounts } = useAllDiscounts();
    const { control, setValue, getValues } =
      useFormContext<OrderFormInputType>();

    const handlePageChange = (_event: any, newPage: number): void => {
      setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setLimit(parseInt(event.target.value));
    };

    const settingDiscount = (discount: Discount) => {
      const price = getValues(`orderItems.${discountOrderItem}.price`);
      var newPrice = 0;
      if (discount.discountType == Percentage) {
        setValue(
          `orderItems.${discountOrderItem}.discountRate`,
          discount.amount
        );
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
      handleDiscountClose();
    };

    useEffect(() => {
      getDiscounts({ offset: page * limit, limit });
    }, [getDiscounts]);

    return (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleDiscountClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t('Select discount')}
            </Typography>
            <DialogContent
              dividers
              sx={{
                p: 3,
                pb: 0
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    sx={{
                      m: 0
                    }}
                    onChange={(e) => setFormValue(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchTwoToneIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              getDiscounts({ offset: page * limit, limit })
                            }
                          >
                            {t('Search')}
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    placeholder={t('Search by discount name')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('Discount id')}</TableCell>
                            <TableCell>{t('Discount name')}</TableCell>
                            <TableCell>{t('Discount amount')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {discounts.map((discount, index) => {
                            return (
                              <TableRow
                                hover
                                key={index}
                                onClick={() => settingDiscount(discount)}
                              >
                                <TableCell>
                                  <Typography noWrap>{discount.id}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography noWrap variant="h5">
                                    {discount.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography noWrap>
                                    {numeral(discount.amount).format(`0,0`)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box>
                      <TablePagination
                        component="div"
                        count={totalCount}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 15]}
                        labelRowsPerPage={t('Rows per page')}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </DialogTitle>
        </Dialog>
      </>
    );
  }
);

export default DialogSelectSearchDiscount;
