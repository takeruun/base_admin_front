import { useEffect, VFC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  DialogActions,
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
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import numeral from 'numeral';
import { getProdcutTypeValue } from 'src/models/product';
import { useDialogSelectSearchOrderItem } from './store';
import { DialogSelectSearchOrderItemPropsType } from './types';

const DialogSelectSearchOrderItem: VFC<DialogSelectSearchOrderItemPropsType> =
  memo(
    ({
      handleCreateOrderItemClose,
      productType,
      selectProductIds,
      addOrderItem
    }) => {
      const { t }: { t: any } = useTranslation();
      const {
        selectedProducts,
        page,
        limit,
        categories,
        totalProductCount,
        products,

        register,
        setValue,
        getValues,

        getCategories,
        getProductsSearch,
        handlePageChange,
        handleLimitChange,
        handleSelectOneProduct,
        handleCreateOrderItem
      } = useDialogSelectSearchOrderItem(selectProductIds);

      useEffect(() => {
        getCategories();
      }, []);

      useEffect(() => {
        getProductsSearch({
          category_id: getValues('categoryId'),
          product_type: getProdcutTypeValue(productType),
          name: getValues('name'),
          offset: page * limit,
          limit
        });
      }, [page, limit]);

      return (
        <>
          <DialogTitle>
            <Typography variant="h4" gutterBottom>
              {t('Select order item')}
            </Typography>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              p: 3,
              pb: 0
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Box>
                  <Autocomplete
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, option) => {
                      setValue('categoryId', option['id']);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={t('Category')}
                        placeholder={t('Select category...')}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Box>
                  <TextField
                    sx={{
                      m: 0
                    }}
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
                              getProductsSearch({
                                category_id: getValues('categoryId'),
                                product_type: getProdcutTypeValue(productType),
                                name: getValues('name'),
                                offset: page * limit,
                                limit
                              })
                            }
                          >
                            {t('Search')}
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    {...register('name')}
                    placeholder={t('Search by product name')}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>{t('Order item name')}</TableCell>
                          <TableCell>{t('Item price')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => {
                          const isProductSelected = selectedProducts.includes(
                            product.id
                          );
                          return (
                            <TableRow
                              hover
                              key={product.id}
                              selected={isProductSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isProductSelected}
                                  onChange={(event) =>
                                    handleSelectOneProduct(event, product.id)
                                  }
                                  value={isProductSelected}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography noWrap variant="h5">
                                  {product.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap>
                                  ¥{numeral(product.price).format(`0,0`)}
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
                      count={totalProductCount}
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

          <DialogActions
            sx={{
              p: 2
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled={selectedProducts.length == 0}
              onClick={() => {
                handleCreateOrderItem(addOrderItem);
                handleCreateOrderItemClose();
              }}
            >
              {t('Add new order item')}
            </Button>
          </DialogActions>
        </>
      );
    }
  );

export default DialogSelectSearchOrderItem;
