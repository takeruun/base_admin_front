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
import { SalesData } from 'src/models/salesData';
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
  const [chartData, setChartData] = useState<SalesData[] | null>([]);
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
          product_types: currentTab == 'course' ? [1] : [2]
        };
      }
      request({
        url: '/v1/orders/sales_data',
        method: 'GET',
        reqParams: {
          params: {
            ...params,
            section,
            period,
            date_of_exit_ymd_from: format(
              section == 'day'
                ? subDays(now, period)
                : setDay(subMonths(now, period), 1),
              'yyyy-MM-dd'
            ),
            date_of_exit_ymd_to: format(
              section == 'day' ? now : subDays(setDay(addMonths(now, 1), 1), 1),
              'yyyy-MM-dd'
            )
          }
        }
      }).then((response) => {
        if (response.data.salesChartData) {
          setData({
            totalPrice: response.data.salesResult.totalPrice,
            rate: response.data.salesResult.rate,
            up: response.data.salesResult.up
          });

          setOptions({
            ...options,
            labels: response.data.salesChartData.days,
            legend: { show: currentTab == 'all' }
          });

          setChartData(response.data.salesChartData.chartData);
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
