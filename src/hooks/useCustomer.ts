import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import { useSnackbar } from 'notistack';
import request from 'src/hooks/useRequest';
import type { Customer } from 'src/models/customer';

export const useCustomer = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCostomerCount, setTotalCostomerCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCustomers = useCallback((params) => {
    try {
      request({
        url: `/v1/users`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setCustomers(response.data.users);
          setTotalCostomerCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteCustomer = useCallback((deleteId: number) => {
    request({
      url: `/v1/users/${deleteId}`,
      method: 'DELETE'
    }).then(() => {
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
      enqueueSnackbar(t('The customer account has been removed'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });
  }, []);

  return {
    customers,
    totalCostomerCount,
    getCustomers,
    deleteCustomer
  };
};
