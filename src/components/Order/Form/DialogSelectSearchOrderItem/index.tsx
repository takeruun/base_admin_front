import { useState, useEffect, FC, ChangeEvent, memo } from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Dialog,
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

import { useAllProducts } from 'src/hooks/useProduct';
import { useAllCategories } from 'src/hooks/useCategory';
import { ProductType, getProdcutTypeValue } from 'src/models/product';
import { OrderFormInputType } from '..';

type FormInputType = {
  categoryId: number;
  name: string;
};

type DialogSelectSearchOrderItemPropsType = {
  handleCreateOrderItemClose: () => void;
  intialOrderItemIds: number[];
  productType: ProductType;
  handleAddSelectProductIds: (productId: number) => void;
};

const DialogSelectSearchOrderItem: FC<DialogSelectSearchOrderItemPropsType> =
  memo(
    ({
      handleCreateOrderItemClose,
      intialOrderItemIds,
      productType,
      handleAddSelectProductIds
    }) => {
      const { t }: { t: any } = useTranslation();
      const { control } = useFormContext<OrderFormInputType>();
      const { append } = useFieldArray({
        control,
        name: 'orderItems',
        keyName: 'key'
      });

      const [selectedProducts, setSelectedProducts] =
        useState<number[]>(intialOrderItemIds);
      const [page, setPage] = useState<number>(0);
      const [limit, setLimit] = useState<number>(5);
      const { getCategories, categories } = useAllCategories();
      const { getProductsSearch, totalCount, products } = useAllProducts();

      const {
        register,
        setValue,
        getValues,
        formState: { isSubmitting }
      } = useForm<FormInputType>({
        defaultValues: {
          categoryId: 0,
          name: ''
        }
      });

      const handleSelectOneProduct = (
        _event: ChangeEvent<HTMLInputElement>,
        productId: number
      ): void => {
        if (!selectedProducts.includes(productId)) {
          setSelectedProducts((prevSelected) => [...prevSelected, productId]);
        } else {
          setSelectedProducts((prevSelected) =>
            prevSelected.filter((id) => id !== productId)
          );
        }
      };

      const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
      };

      const handleLimitChange = (
        event: ChangeEvent<HTMLInputElement>
      ): void => {
        setLimit(parseInt(event.target.value));
      };

      const handleCreateOrderItem = (): void => {
        selectedProducts.forEach((itemId) => {
          const product = products.find(
            (p) => p.id == itemId && !intialOrderItemIds.includes(itemId)
          );
          if (product) {
            handleAddSelectProductIds(product.id);
            append({
              name: product.name,
              productId: product.id,
              price: product.price,
              taxRate: 10,
              quantity: 1,
              otherPerson: false,
              productType: product.productType,
              discountAmount: 0,
              discountRate: 0
            });
          }
        });
      };

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
              <Grid item xs={6}>
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

          <DialogActions
            sx={{
              p: 3,
              pt: 0
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled={selectedProducts.length == 0}
              onClick={() => {
                handleCreateOrderItem();
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
