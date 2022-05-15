import { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import {
  Box,
  Card,
  Divider,
  Drawer,
  Dialog,
  styled,
  useTheme
} from '@mui/material';
import Actions from './Actions';
import EventDrawer from './EventDrawer';
import EasyOrderCreation from './EasyOrderCreation';
import { useCalendarState } from './store';

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

const Calender = () => {
  const theme = useTheme();
  const {
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
  } = useCalendarState();

  useEffect(() => {
    getOrderCalendar(date, view);
  }, [date, view]);

  useEffect(() => {
    const changedView = mobile ? 'listWeek' : 'dayGridMonth';
    changeView(changedView);
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
        open={isDrawerOpen}
        elevation={9}
      >
        {isDrawerOpen && (
          <EventDrawer
            event={events.find(
              (_event) => _event.id === String(selectOrderCalendarId)
            )}
          />
        )}
      </Drawer>
      <Dialog
        fullWidth
        open={isEasyOrderCreationOpen}
        onClose={handleCloseDialog}
      >
        <EasyOrderCreation />
      </Dialog>
    </>
  );
};

export default Calender;
