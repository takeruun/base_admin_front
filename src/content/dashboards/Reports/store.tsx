import { useState, useCallback, ChangeEvent, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Zoom, useTheme } from '@mui/material';
import numeral from 'numeral';
import { format, setDay, subDays } from 'date-fns';
import { addMonths, subMonths } from 'date-fns/esm';
import { useSnackbar } from 'notistack';
import FullCalendar, { EventDropArg } from '@fullcalendar/react';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import type { ApexOptions } from 'apexcharts';
import { useOrder } from 'src/hooks/useOrder';
import { Cancel } from 'src/models/order';
import { productTypes } from 'src/models/product';
import request from 'src/hooks/useRequest';
import { FontRateContext } from 'src/theme/ThemeProvider';
import {
  updateDashboardOrder,
  useDashboardState,
  useDashboardDispatch
} from 'src/contexts/DashboardContext';
import { useOrderCalendar } from 'src/hooks/useOrderCalendar';

export const useTodayReservationListState = () => {
  const { getTodayReservationOrders } = useOrder();
  const { orders } = useDashboardState();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [orderInfo, setOrderInfo] =
    useState<{ orderId: number; name: string; phoneNumber: string }>();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number) => setPage(newPage);
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLimit(parseInt(event.target.value));

  const store = {
    orders,
    page,
    limit,
    query,
    orderInfo,
    open,

    getTodayReservationOrders,
    handleOpen,
    handleClose,
    handleQueryChange,
    setOrderInfo
  };

  return store;
};

export const useCalendarTodayReservationState = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const { getOrderCalendarTimeline } = useOrderCalendar();
  const { events, resources } = useDashboardState();
  const dashboradDispatch = useDashboardDispatch();
  const { putOrderTime } = useOrder();

  const handleEventResize = ({ event }: EventResizeDoneArg) => {
    try {
      putOrderTime(
        parseInt(event.id),
        {
          dateOfVisit: event.start,
          dateOfExit: event.end
        },
        (order) => {
          dashboradDispatch(updateDashboardOrder(order));
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDrop = ({ event }: EventDropArg) => {
    try {
      putOrderTime(
        parseInt(event.id),
        {
          dateOfVisit: event.start,
          dateOfExit: event.end
        },
        (order) => {
          dashboradDispatch(updateDashboardOrder(order));
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const store = {
    calendarRef,
    date,
    events,
    resources,

    getOrderCalendarTimeline,
    handleEventResize,
    handleEventDrop
  };

  return store;
};

export const useSaleDataState = () => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const chartOptions: ApexOptions = {
    theme: {
      mode: theme.palette.mode
    },
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },

    colors: [theme.colors.primary.main, theme.colors.error.main],
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    legend: {
      show: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        },
        formatter: function (val) {
          return '¥' + numeral(val).format('0,0');
        }
      }
    }
  };

  const actionRef1 = useRef<any>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [section, setSection] = useState(t('Aggregation section'));

  const [currentTab, setCurrentTab] = useState('course');
  const [options, setOptions] = useState<ApexOptions>(chartOptions);
  const [chartData, setChartData] = useState<
    { name: string; type: string; data: number[] }[] | null
  >([]);
  const [data, setData] = useState<{
    totalPrice: number;
    rate: number;
    up: boolean;
  } | null>(null);

  const handleOpenMenu = () => setOpenMenu(true);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const getSaleData = useCallback(async () => {
    try {
      const now = new Date();
      const period = section == 'day' ? 14 : 6;

      var params = {};
      if (currentTab == 'all') {
        params = {
          product_types: [1, 2]
        };
      } else {
        params = {
          product_type: currentTab == 'course' ? 1 : 2
        };
      }
      request({
        url: '/v1/orders/sales_data',
        method: 'GET',
        reqParams: {
          params: {
            ...params,
            section,
            date_of_exit_from: format(
              section == 'day'
                ? subDays(now, period)
                : setDay(subMonths(now, period), 1),
              'yyyy-MM-dd'
            ),
            date_of_exit_to: format(
              section == 'day' ? now : subDays(setDay(addMonths(now, 1), 1), 1),
              'yyyy-MM-dd'
            )
          }
        }
      }).then((response) => {
        if (response.data.salesData) {
          const priceIndex = currentTab == 'course' ? 1 : 2;
          var days = [];
          var prices = [];
          if (currentTab == 'all') {
            prices[1] = [];
            prices[2] = [];
          } else {
            prices[priceIndex] = [];
          }

          for (let i = period; i > 0; i--) {
            const salesData = response.data.salesData.filter((sd) => {
              if (
                sd.day ==
                format(
                  section == 'day' ? subDays(now, i) : subMonths(now, i),
                  section == 'day' ? 'yyyy-M-d' : 'yyyy-M'
                )
              )
                return sd;
            });

            days.push(
              format(
                section == 'day' ? subDays(now, i) : subMonths(now, i),
                section == 'day' ? 'M/d' : 'yyyy/M'
              )
            );
            if (salesData.length > 0) {
              if (salesData.find((s) => s.productType == 1))
                prices[1].push(
                  salesData.find((s) => s.productType == 1).totalPrice
                );
              if (salesData.find((s) => s.productType == 2))
                prices[2].push(
                  salesData.find((s) => s.productType == 2).totalPrice
                );
              if (
                salesData.find((s) => s.productType == 2) == undefined &&
                currentTab == 'all'
              )
                prices[2].push(0);

              if (
                salesData.find((s) => s.productType == 1) == undefined &&
                currentTab == 'all'
              )
                prices[1].push(0);
            } else {
              if (currentTab == 'all') {
                prices[1].push(0);
                prices[2].push(0);
              } else {
                prices[priceIndex].push(0);
              }
            }
          }

          setData({
            totalPrice: response.data.salesResult.totalPrice,
            rate: response.data.salesResult.rate,
            up: response.data.salesResult.up
          });

          const chartData = [];
          if (currentTab == 'all') {
            prices.forEach((price, i) => {
              chartData.push({
                name: productTypes.find((p) => p.value == i)['label'],
                type: 'column',
                data: price
              });
            });
            setOptions({ ...options, labels: days, legend: { show: true } });
          } else {
            chartData.push({
              name: response.data.salesData[0].productType,
              type: 'column',
              data: prices[response.data.salesData[0].productType]
            });
            setOptions({ ...options, labels: days });
          }
          setChartData(chartData);
        } else setChartData(null);
      });
    } catch (e) {
      console.error(e);
    }
  }, [currentTab, section]);

  const store = {
    actionRef1,
    openMenu,
    section,
    currentTab,
    options,
    chartData,
    data,

    setSection,
    handleOpenMenu,
    handleCloseMenu,
    handleTabsChange,
    getSaleData
  };

  return store;
};

export const useUpdateOrderFormState = () => {
  const { t }: { t: any } = useTranslation();
  const getFontRate = useContext(FontRateContext);
  const fontRate = getFontRate();
  const { enqueueSnackbar } = useSnackbar();
  const { putOrderStatus } = useOrder();
  const dashboradDispatch = useDashboardDispatch();

  const [openConfirmCancel, setOpenConfirmCancle] = useState(false);
  const handleConfirmCancel = () => setOpenConfirmCancle(true);
  const closeConfirmCancel = () => setOpenConfirmCancle(false);

  const handleCancelCompleted = (orderId: number, successCallback = null) => {
    try {
      putOrderStatus(orderId, { status: Cancel }, (order) => {
        setOpenConfirmCancle(false);
        dashboradDispatch(updateDashboardOrder(order));
        enqueueSnackbar(t('The order has been canceled'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
        if (successCallback) successCallback();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const store = {
    fontRate,
    openConfirmCancel,

    handleConfirmCancel,
    closeConfirmCancel,
    handleCancelCompleted
  };

  return store;
};
