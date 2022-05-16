import { useState, useCallback } from 'react';
import { Zoom } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import request from 'src/hooks/useRequest';
import type { Product } from 'src/models/product';

export const useProduct = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProductCount, setTotalProductCount] = useState(0);

  const getProductsSearch = useCallback((params) => {
    try {
      request({
        url: '/v1/products/search',
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setProducts(response.data.products);
          setTotalProductCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteProduct = useCallback((deleteId: number) => {
    request({
      url: `/v1/products/${deleteId}`,
      method: 'DELETE'
    }).then(() => {
      setProducts(products.filter((c) => c.id !== deleteId));
      enqueueSnackbar(t('The product has been removed'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });
  }, []);

  return { getProductsSearch, deleteProduct, totalProductCount, products };
};
