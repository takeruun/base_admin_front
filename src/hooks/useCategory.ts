import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Zoom } from '@mui/material';
import request from 'src/hooks/useRequest';
import type { Category } from 'src/models/category';

export const useCategory = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);

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
          setCategories(response.data.categories);
          setTotalCategoryCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteCategory = useCallback(
    (categoryId: number, successCallback = null) => {
      try {
        request({
          url: `/v1/categories/${categoryId}`,
          method: 'DELETE'
        })
          .then(() => {
            setCategories((prev) => prev.filter((c) => c.id !== categoryId));
            enqueueSnackbar(t('The category has been removed'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
            if (successCallback) successCallback();
          })
          .catch(() => {
            enqueueSnackbar(t('Faild to delete category'), {
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
          });
      } catch (e) {}
    },
    []
  );

  return { getCategories, deleteCategory, categories, totalCategoryCount };
};
