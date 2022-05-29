import { useEffect, VFC, memo } from 'react';
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
  DialogTitle
} from '@mui/material';
import numeral from 'numeral';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Pagination from 'src/components/molecule/Pagination';
import { useDialogSelectSearchDiscount } from './store';
import { DialogSelectSearchDiscountProps } from './types';

const DialogSelectSearchDiscount: VFC<DialogSelectSearchDiscountProps> = memo(
  ({ open, discountOrderItem, handleDiscountClose, selectDiscount }) => {
    const { t }: { t: any } = useTranslation();
    const {
      page,
      limit,
      discounts,
      totalCount,

      getDiscounts,
      handleSetFromValue,
      handlePageChange,
      handleLimitChange
    } = useDialogSelectSearchDiscount();

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
                    onChange={(e) => handleSetFromValue(e.target.value)}
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
                                onClick={() => {
                                  selectDiscount(discountOrderItem, discount);
                                  handleDiscountClose();
                                }}
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
                      <Pagination
                        count={totalCount}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
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
