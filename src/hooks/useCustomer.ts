import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import { useSnackbar } from 'notistack';
import request from 'src/hooks/useRequest';
import type { Customer } from 'src/models/customer';

export const useCustomer = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [customer, setCustomer] = useState<Customer>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCustomer = useCallback((customerId: number) => {
    setLoading(true);
    try {
      request({
        url: `/v1/customers/${customerId}`,
        method: 'GET'
      })
        .then((response) => {
          setCustomer(response.data.customer);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getCustomers = useCallback((params) => {
    try {
      request({
        url: `/v1/customers`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setCustomers(response.data.customers);
          setTotalCustomerCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteCustomer = useCallback((deleteId: number) => {
    request({
      url: `/v1/customers/${deleteId}`,
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
    customer,
    customers,
    totalCustomerCount,
    getCustomer,
    getCustomers,
    deleteCustomer
  };
};
