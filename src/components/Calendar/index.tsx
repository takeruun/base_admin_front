import { FC, useState, useRef, useEffect, useCallback } from 'react';
import FullCalendar, { EventClickArg, EventDropArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  DateClickArg,
  EventResizeDoneArg
} from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import {
  Box,
  Card,
  Divider,
  Drawer,
  Dialog,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';

import type { View } from 'src/models/calendar';
import { useOrderCalendarState } from 'src/contexts/OrderCalendarContext';
import { useOrderCalendar } from 'src/hooks/useOrderCalendar';
import { useOrder } from 'src/hooks/useOrder';

import Actions from './Actions';
import EventDrawer from './EventDrawer';
import EasyOrderCreation from './EasyOrderCreation';

const FullCalendarWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};

    & .fc-license-message {
      display: none;
    }
    .fc {

      .fc-col-header-cell {
        padding: ${theme.spacing(1)};
        background: ${theme.colors.alpha.black[5]};
      }

      .fc-scrollgrid {
        border: 2px solid ${theme.colors.alpha.black[10]};
        border-right-width: 1px;
        border-bottom-width: 1px;
      }

      .fc-cell-shaded,
      .fc-list-day-cushion {
        background: ${theme.colors.alpha.black[5]};
      }

      .fc-list-event-graphic {
        padding-right: ${theme.spacing(1)};
      }

      .fc-theme-standard td, .fc-theme-standard th,
      .fc-col-header-cell {
        border: 1px solid ${theme.colors.alpha.black[10]};
      }

      .fc-event {
        padding: ${theme.spacing(0.1)} ${theme.spacing(0.3)};
      }

      .fc-list-day-side-text {
        font-weight: normal;
        color: ${theme.colors.alpha.black[70]};
      }

      .fc-list-event:hover td,
      td.fc-daygrid-day.fc-day-today {
        background-color: ${theme.colors.primary.lighter};
      }

      td.fc-daygrid-day:hover,
      .fc-highlight {
        background: ${theme.colors.alpha.black[10]};
      }

      .fc-daygrid-dot-event:hover, 
      .fc-daygrid-dot-event.fc-event-mirror {
        background: ${theme.colors.primary.lighter};
      }

      .fc-daygrid-day-number {
        padding: ${theme.spacing(1)};
        font-weight: bold;
      }

      .fc-list-sticky .fc-list-day > * {
        background: ${theme.colors.alpha.black[5]} !important;
      }

      .fc-cell-shaded, 
      .fc-list-day-cushion {
        background: ${theme.colors.alpha.black[10]} !important;
        color: ${theme.colors.alpha.black[70]} !important;
      }

      &.fc-theme-standard td, 
      &.fc-theme-standard th,
      &.fc-theme-standard .fc-list {
        border-color: ${theme.colors.alpha.black[30]};
      }
    }
`
);

const Calender: FC = () => {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar | null>(null);
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const { events } = useOrderCalendarState();
  const { getOrderCalendar, putOrderCalendar } = useOrderCalendar();
  const { putOrderTime } = useOrder();

  const [view, setView] = useState<View>(mobile ? 'listWeek' : 'dayGridMonth');
  const [date, setDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState('');
  const [selectTime, setSelectTime] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    if (view !== 'dayGridMonth') setSelectTime(format(args.date, 'HH:mm'));
    else setSelectTime(null);
    setSelectDate(args.dateStr);
    setDialogOpen(true);
  };

  const handleEventSelect = (arg: EventClickArg): void => {
    setSelectOrderCalendarId(parseInt(arg.event.id));
    setDrawerOpen(true);
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

  const handleCloseDialog = useCallback(() => setDialogOpen(false), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    getOrderCalendar(date, view);
  }, [date, view]);

  useEffect(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      const changedView = mobile ? 'listWeek' : 'dayGridMonth';

      calApi.changeView(changedView);
      setView(changedView);
    }
  }, [mobile]);

  return (
    <>
      <Card>
        <Box p={3}>
          <Actions
            date={date}
            endDate={date}
            onNext={handleDateNext}
            onPrevious={handleDatePrev}
            onToday={handleDateToday}
            changeView={changeView}
            view={view}
          />
        </Box>
        <Divider />
        <FullCalendarWrapper>
          <FullCalendar
            locale={jaLocale}
            allDayMaintainDuration
            initialDate={date}
            initialView={view}
            droppable
            editable
            dateClick={handleDateClick}
            eventDisplay="block"
            eventClick={handleEventSelect}
            eventDrop={handleEventDrop}
            dayMaxEventRows={4}
            eventResizableFromStart
            eventResize={handleEventResize}
            events={events}
            headerToolbar={false}
            height={660}
            ref={calendarRef}
            rerenderDelay={10}
            selectable
            weekends
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin
            ]}
          />
        </FullCalendarWrapper>
      </Card>
      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        onClose={handleCloseDrawer}
        open={drawerOpen}
        elevation={9}
      >
        {drawerOpen && (
          <EventDrawer
            event={events.find(
              (_event) => _event.id === String(selectOrderCalendarId)
            )}
            onCancel={handleCloseDrawer}
            onDeleteComplete={handleCloseDrawer}
          />
        )}
      </Drawer>
      <Dialog fullWidth open={dialogOpen} onClose={handleCloseDialog}>
        <EasyOrderCreation
          onClose={handleCloseDialog}
          selectDate={selectDate}
          selectTime={selectTime}
        />
      </Dialog>
    </>
  );
};

export default Calender;
