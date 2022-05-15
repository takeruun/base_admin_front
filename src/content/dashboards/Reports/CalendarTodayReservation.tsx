import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { Box, Card, styled } from '@mui/material';
import { setHours, setMinutes, setSeconds } from 'date-fns';
import { useCalendarTodayReservationState } from './store';

const FullCalendarWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};
    .fc-timeline-event-harness {
      margin-top: 8px;
    }
`
);

const CalendarTodayReservation = () => {
  const { t }: { t: any } = useTranslation();
  const {
    calendarRef,
    date,
    events,
    resources,

    getOrderCalendarTimeline,
    handleEventResize,
    handleEventDrop
  } = useCalendarTodayReservationState();

  useEffect(() => {
    const startDate: Date = setSeconds(setMinutes(setHours(date, 0), 0), 0);
    const endDate: Date = setSeconds(
      setMinutes(setHours(startDate, 23), 59),
      59
    );

    getOrderCalendarTimeline(startDate, endDate);
  }, [date]);

  return (
    <>
      <Card>
        <FullCalendarWrapper>
          <FullCalendar
            locale={jaLocale}
            allDayMaintainDuration
            initialDate={date}
            resourceAreaHeaderContent={t('Reservations today')}
            initialView={'resourceTimeline'}
            droppable
            editable
            eventDisplay="block"
            eventDrop={handleEventDrop}
            dayMaxEventRows={4}
            eventResizableFromStart
            eventResize={handleEventResize}
            events={events}
            resources={resources}
            headerToolbar={false}
            height={400}
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
            plugins={[resourceTimelinePlugin, interactionPlugin]}
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          />
        </FullCalendarWrapper>
      </Card>
    </>
  );
};

export default CalendarTodayReservation;
