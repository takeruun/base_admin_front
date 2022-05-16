import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Zoom } from '@mui/material';
import request from 'src/hooks/useRequest';
import type { Product } from 'src/models/product';

export const useCourse = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState<Product[]>([]);
  const [totalCourseCount, setTotalCourseCount] = useState<number>(0);

  const getCourses = useCallback((params) => {
    try {
      request({
        url: '/v1/products',
        method: 'GET',
        reqParams: {
          params
        }
      }).then((response) => {
        setCourses(response.data.products);
        setTotalCourseCount(response.data.totalCount);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteCourse = useCallback((deleteId: number) => {
    request({
      url: `/v1/products/${deleteId}`,
      method: 'DELETE'
    })
      .then(() => {
        setCourses(courses.filter((c) => c.id !== deleteId));
        enqueueSnackbar(t('The course has been removed'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      })
      .catch(() => {
        enqueueSnackbar(t('Faild to delete course'), {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });
  }, []);

  return { courses, totalCourseCount, getCourses, deleteCourse };
};
