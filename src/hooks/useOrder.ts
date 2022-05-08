import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import type { Order } from 'src/models/order';
import {
  setOrders,
  updateOrder,
  useOrderDispatch
} from 'src/contexts/OrderContext';

export const useOrder = () => {
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState<boolean>(false);
  const orderDispatch = useOrderDispatch();

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
        orderDispatch(
          setOrders(response.data.orders, response.data.totalCount)
        );
      });
    },
    []
  );

  const putOrderStatus = useCallback((id: number, data: any) => {
    request({
      url: `v1/orders/${id}/status`,
      method: 'PUT',
      reqParams: {
        data
      }
    });
  }, []);

  const putOrderTime = useCallback((id: number, data: any) => {
    request({
      url: `v1/orders/${id}/time`,
      method: 'PUT',
      reqParams: {
        data
      }
    }).then((response) => {
      orderDispatch(updateOrder(response.data.order));
    });
  }, []);

  return {
    getOrder,
    putOrderStatus,
    putOrderTime,
    getTodayReservationOrders,
    order,
    loading
  };
};
