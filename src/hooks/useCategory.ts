import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import type { Category } from 'src/models/category';

export const useAllCategories = () => {
  const [categories, setCategorys] = useState<Category[]>([]);

  const getCategories = useCallback((params?) => {
    try {
      request({
        url: `/v1/categories`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setCategorys(response.data.categories);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getCategories, categories };
};
