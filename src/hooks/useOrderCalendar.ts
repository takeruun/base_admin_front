import { useCallback } from 'react';
import {
  addMonths,
  subDays,
  addDays,
  format,
  setHours,
  setMinutes,
  setSeconds
} from 'date-fns';
import type { Order } from 'src/models/order';
import request from 'src/hooks/useRequest';
import type { OrderEvent, Resource } from 'src/models/calendar';
import { FormIputType as EasyOrderCreationInputType } from 'src/components/Calendar/EasyOrderCreation';
import {
  setEventsResources,
  useDashboardDispatch
} from 'src/contexts/DashboardContext';
import {
  useCalendarDispatch,
  setEvents,
  updateOrderEvent,
  removeOrderEvent
} from 'src/contexts/CalendarContext';

export const useOrderCalendar = () => {
  const dispatchDashboard = useDashboardDispatch();
  const dispatchCalendar = useCalendarDispatch();

  const getOrderCalendar = useCallback((date: Date, view: string) => {
    var startDate: Date = setSeconds(setMinutes(setHours(date, 0), 0), 0);
    var endDate: Date;
    if (view === 'dayGridMonth') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      endDate = setSeconds(
        setMinutes(setHours(subDays(addMonths(startDate, 1), 1), 23), 59),
        59
      );
    } else if (view === 'timeGridWeek' || view === 'listWeek') {
      if (format(startDate, 'EEEE') != 'Sunday')
        startDate = subDays(startDate, Number(format(startDate, 'i')));
      endDate = setSeconds(
        setMinutes(setHours(addDays(startDate, 6), 23), 59),
        59
      );
    } else {
      endDate = setSeconds(setMinutes(setHours(startDate, 23), 59), 59);
    }

    request({
      url: '/v1/orders/search',
      method: 'GET',
      reqParams: {
        params: {
          dateOfVisitFrom: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
          dateOfVisitTo: format(endDate, 'yyyy-MM-dd HH:mm:ss')
        }
      }
    }).then((response) => {
      const events: OrderEvent[] = response.data.orders.map((o: Order) => {
        var description = '';
        o.orderItems.forEach((oi) => {
          if (oi.product.productType === 'コース') {
            description += `${oi.product.name}\n`;
          } else if (oi.product.productType === '商品') {
            description += `${oi.product.name} x ${oi.quantity}\n`;
          }
        });

        return {
          id: String(o.id),
          allDay: false,
          description,
          start: o.dateOfVisit,
          end: o.dateOfExit,
          title: `${o.customer.familyName}${o.customer.givenName}さん`
        };
      });

      dispatchCalendar(setEvents(events));
    });
  }, []);

  const getOrderCalendarTimeline = useCallback((start: Date, end: Date) => {
    request({
      url: '/v1/orders/search',
      method: 'GET',
      reqParams: {
        params: {
          date_of_visit_from: format(start, 'yyyy-MM-dd HH:mm:ss'),
          date_of_visit_to: format(end, 'yyyy-MM-dd HH:mm:ss')
        }
      }
    }).then((response) => {
      const events: OrderEvent[] = response.data.orders.map((o: Order) => {
        var title = '';
        o.orderItems.forEach((oi) => {
          if (oi.product.productType === 'コース') {
            title += `${oi.product.name}\n`;
          } else if (oi.product.productType === '商品') {
            title += `${oi.product.name} x ${oi.quantity}\n`;
          }
        });

        return {
          id: String(o.id),
          resourceId: String(o.id),
          description: `${o.customer.familyName}${o.customer.givenName}さん`,
          start: o.dateOfVisit,
          end: o.dateOfExit,
          title
        };
      });
      const resources: Resource[] = response.data.orders.map((o: Order) => {
        return {
          id: String(o.id),
          title: `${o.customer.familyName}${o.customer.givenName}さん`
        };
      });

      dispatchDashboard(setEventsResources(events, resources));
    });
  }, []);

  const putOrderCalendar = useCallback(
    (id: string, date: { start: Date; end: Date }) => {
      dispatchCalendar(updateOrderEvent(id, date));
    },
    []
  );

  const deleteOrderCalendar = useCallback((id: string) => {
    request({
      url: `/v1/orders/${id}`,
      method: 'DELETE'
    }).then(() => {
      dispatchCalendar(removeOrderEvent(id));
    });
  }, []);

  const postEasyOrderCreation = useCallback(
    (data: EasyOrderCreationInputType, successCallback = null) => {
      const dateOfVisit = new Date(data.dateOfVisit);
      try {
        request({
          url: '/v1/orders/easy_create',
          method: 'POST',
          reqParams: {
            data: {
              ...data,
              dateOfVisit: new Date(
                `${format(dateOfVisit, 'yyyy-MM-dd')} ${data.dateOfVisitTime}`
              ),
              dateOfExit: new Date(
                `${format(dateOfVisit, 'yyyy-MM-dd')} ${data.dateOfExit}`
              )
            }
          }
        }).then((response) => {
          const order = response.data.order;
          var description = '';
          order.orderItems.forEach((oi) => {
            if (oi.product.productType === 'コース') {
              description += `${oi.product.name}\n`;
            } else if (oi.product.productType === '商品') {
              description += `${oi.product.name} x ${oi.quantity}\n`;
            }
          });
          const event: OrderEvent = {
            id: String(order.id),
            allDay: false,
            description,
            start: order.dateOfVisit,
            end: order.dateOfExit,
            title: `${order.customer.familyName}${order.customer.givenName}さん`
          };
          if (successCallback) successCallback(event);
        });
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  return {
    getOrderCalendarTimeline,
    getOrderCalendar,
    putOrderCalendar,
    deleteOrderCalendar,
    postEasyOrderCreation
  };
};
