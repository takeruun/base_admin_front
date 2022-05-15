import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import request from 'src/hooks/useRequest';
import type { Order } from 'src/models/order';
import {
  setDashboardOrders,
  useDashboardDispatch
} from 'src/contexts/DashboardContext';

export const useOrder = () => {
  const { t }: { t: any } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState<boolean>(false);
  const dashboradDispatch = useDashboardDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const getOrder = useCallback((orderId: number) => {
    setLoading(true);
    try {
      request({
        url: `/v1/orders/${orderId}`,
        method: 'GET'
      })
        .then((response) => {
          setOrder(response.data.order);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getOrders = useCallback((page, limit) => {
    try {
      request({
        url: '/v1/orders/search',
        method: 'GET',
        reqParams: {
          params: {
            offset: page * limit,
            limit,
            sort_column: 'date_of_visit',
            sort_by: 'desc'
          }
        }
      }).then((response) => {
        setOrders(response.data.orders);
        setTotalOrderCount(response.data.totalCount);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteOrder = useCallback((deleteId: number) => {
    request({
      url: `/v1/orders/${deleteId}`,
      method: 'DELETE'
    }).then(() => {
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
      enqueueSnackbar(t('The order has been removed'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });
  }, []);

  const getTodayReservationOrders = useCallback(
    (page: number, limit: number) => {
      request({
        url: 'v1/orders/search',
        method: 'GET',
        reqParams: {
          params: {
            search_type: 'todayReservation',
            offset: page * limit,
            limit
          }
        }
      }).then((response) => {
        dashboradDispatch(setDashboardOrders(response.data.orders));
      });
    },
    []
  );

  const putOrderStatus = useCallback(
    (id: number, data: any, successCallback = null) => {
      request({
        url: `v1/orders/${id}/status`,
        method: 'PUT',
        reqParams: {
          data
        }
      }).then((response) => {
        if (successCallback) successCallback(response.data.order);
      });
    },
    []
  );

  const putOrderTime = useCallback(
    (id: number, data: any, successCallback = null) => {
      request({
        url: `v1/orders/${id}/time`,
        method: 'PUT',
        reqParams: {
          data
        }
      }).then((response) => {
        if (successCallback) successCallback(response.data.order);
      });
    },
    []
  );

  return {
    getOrders,
    getOrder,
    putOrderStatus,
    putOrderTime,
    getTodayReservationOrders,
    deleteOrder,

    orders,
    order,
    totalOrderCount,
    loading
  };
};
