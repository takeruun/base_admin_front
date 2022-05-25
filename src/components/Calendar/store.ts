import { useState, useRef, useCallback, ChangeEvent } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Zoom, useTheme, useMediaQuery } from '@mui/material';
import FullCalendar, { EventClickArg, EventDropArg } from '@fullcalendar/react';
import { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import type { View } from 'src/models/calendar';
import type { OrderEvent } from 'src/models/calendar';
import { useOrderCalendar } from 'src/hooks/useOrderCalendar';
import { useOrder } from 'src/hooks/useOrder';
import { useCustomer } from 'src/hooks/useCustomer';
import {
  useCalendarState,
  useCalendarDispatch,
  openEasyOrderCreation,
  closeEasyOrderCreation,
  setSelectDate,
  setSelectTime,
  openDrawer,
  closeDrawer,
  addOrderEvent
} from 'src/contexts/CalendarContext';
import { FormInputType } from './types';

export const useCalendar = () => {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar | null>(null);
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const { events, isEasyOrderCreationOpen, isDrawerOpen } = useCalendarState();
  const dispatchCalendar = useCalendarDispatch();
  const { getOrderCalendar, putOrderCalendar } = useOrderCalendar();
  const { putOrderTime } = useOrder();

  const [view, setView] = useState<View>(mobile ? 'listWeek' : 'dayGridMonth');
  const [date, setDate] = useState(new Date());
  const [selectOrderCalendarId, setSelectOrderCalendarId] = useState(0);

  const handleDateToday = useCallback(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      calApi.today();
      setDate(calApi.getDate());
    }
  }, [calendarRef]);

  const changeView = useCallback(
    (changedView: View) => {
      const calItem = calendarRef.current;

      if (calItem) {
        const calApi = calItem.getApi();
        calApi.changeView(changedView);
        setView(changedView);
        setDate(calApi.getDate());
      }
    },
    [calendarRef]
  );

  const handleDatePrev = useCallback(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      calApi.prev();
      setDate(calApi.getDate());
    }
  }, [calendarRef]);

  const handleDateNext = useCallback(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      calApi.next();
      setDate(calApi.getDate());
    }
  }, [calendarRef]);

  const handleDateClick = (args: DateClickArg) => {
    if (view !== 'dayGridMonth')
      dispatchCalendar(setSelectTime(format(args.date, 'HH:mm')));
    else dispatchCalendar(setSelectTime(null));
    dispatchCalendar(setSelectDate(args.dateStr));
    dispatchCalendar(openEasyOrderCreation());
  };

  const handleEventSelect = (arg: EventClickArg): void => {
    setSelectOrderCalendarId(parseInt(arg.event.id));
    dispatchCalendar(openDrawer());
  };

  const handleEventResize = ({ event }: EventResizeDoneArg): void => {
    try {
      putOrderTime(parseInt(event.id), {
        dateOfVisit: event.start,
        dateOfExit: event.end
      });
      putOrderCalendar(event.id, {
        start: event.start,
        end: event.end
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDrop = ({ event }: EventDropArg): void => {
    try {
      putOrderTime(parseInt(event.id), {
        dateOfVisit: event.start,
        dateOfExit: event.end
      });
      putOrderCalendar(event.id, {
        start: event.start,
        end: event.end
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDialog = useCallback(
    () => dispatchCalendar(closeEasyOrderCreation()),
    []
  );
  const handleCloseDrawer = useCallback(
    () => dispatchCalendar(closeDrawer()),
    []
  );

  const store = {
    calendarRef,
    mobile,
    events,
    view,
    date,
    isEasyOrderCreationOpen,
    isDrawerOpen,
    selectOrderCalendarId,

    getOrderCalendar,
    handleDateToday,
    changeView,
    handleDatePrev,
    handleDateNext,
    handleDateClick,
    handleEventSelect,
    handleEventResize,
    handleEventDrop,
    handleCloseDialog,
    handleCloseDrawer
  };

  return store;
};

export const useEasyOrderCreation = () => {
  const dispatchCalendar = useCalendarDispatch();
  const { selectDate, selectTime } = useCalendarState();
  const { postEasyOrderCreation } = useOrderCalendar();
  const {
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      customerId: 0,
      dateOfVisit: selectDate,
      dateOfVisitTime: selectTime ?? '',
      dateOfExit: '',
      memo: ''
    }
  });

  const onSubmit = (data: FormInputType) => {
    postEasyOrderCreation(data, (event: OrderEvent) => {
      dispatchCalendar(addOrderEvent(event));
      dispatchCalendar(closeEasyOrderCreation());
    });
  };

  const [userName, setUserName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = useCallback(() => setDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setDialogOpen(false), []);
  const handleSelectCustomer = useCallback(
    (customerId: number) => setValue('customerId', customerId),
    []
  );
  const handleSetUserName = useCallback(
    (userName: string) => setUserName(userName),
    []
  );

  const handleCloseEasyOrderCreation = () =>
    dispatchCalendar(closeEasyOrderCreation());

  const store = {
    getValues,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    userName,
    dialogOpen,

    onSubmit,
    handleOpenDialog,
    handleCloseDialog,
    handleSelectCustomer,
    handleSetUserName,
    handleCloseEasyOrderCreation
  };

  return store;
};

export const useEventDrawer = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatchCalendar = useCalendarDispatch();
  const { deleteOrderCalendar } = useOrderCalendar();

  const handleDelete = (eventId: string) => {
    try {
      deleteOrderCalendar(eventId);
      dispatchCalendar(closeDrawer());

      enqueueSnackbar(t('The event has been deleted'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        TransitionComponent: Zoom
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDrawer = useCallback(
    () => dispatchCalendar(closeDrawer()),
    []
  );

  const store = {
    handleDelete,
    handleCloseDrawer
  };

  return store;
};

export const useSelectCustomer = () => {
  const { customers, totalCustomerCount, getCustomers } = useCustomer();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const store = {
    customers,
    totalCustomerCount,
    query,
    page,
    limit,

    setQuery,
    getCustomers,
    handlePageChange,
    handleLimitChange
  };

  return store;
};
