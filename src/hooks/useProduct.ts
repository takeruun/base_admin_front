import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import type { Product } from 'src/models/product';

export const useAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);

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
          setTotalCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getProductsSearch, totalCount, products };
};
