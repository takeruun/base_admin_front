import { ElementType, FC, memo } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import ViewAgendaTwoToneIcon from '@mui/icons-material/ViewAgendaTwoTone';
import ViewDayTwoToneIcon from '@mui/icons-material/ViewDayTwoTone';
import CalendarViewMonthTwoToneIcon from '@mui/icons-material/CalendarViewMonthTwoTone';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import type { View } from 'src/models/calendar';

interface ActionsProps {
  className?: string;
  date: Date;
  endDate: Date;
  onNext?: () => void;
  onPrevious?: () => void;
  onToday?: () => void;
  handleCreateEvent?: () => void;
  changeView?: (view: View) => void;
  view: View;
}

interface ViewOption {
  label: string;
  value: View;
  icon: ElementType;
}

const viewOptions: ViewOption[] = [
  {
    label: 'Month',
    value: 'dayGridMonth',
    icon: CalendarViewMonthTwoToneIcon
  },
  {
    label: 'Week',
    value: 'timeGridWeek',
    icon: ViewWeekTwoToneIcon
  },
  {
    label: 'Day',
    value: 'timeGridDay',
    icon: ViewDayTwoToneIcon
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: ViewAgendaTwoToneIcon
  }
];

const Actions: FC<ActionsProps> = memo(
  ({ date, onNext, onPrevious, onToday, changeView, view }) => {
    const { t }: { t: any } = useTranslation();

    return (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item>
          <Tooltip arrow placement="top" title={t('Previous Day')}>
            <IconButton color="primary" onClick={onPrevious}>
              <ArrowBackTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="top" title={t('Today')}>
            <IconButton
              color="primary"
              sx={{
                mx: 1
              }}
              onClick={onToday}
            >
              <TodayTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="top" title={t('Next Day')}>
            <IconButton color="primary" onClick={onNext}>
              <ArrowForwardTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid
          item
          sx={{
            display: { xs: 'none', sm: 'inline-block' }
          }}
        >
          <Typography variant="h3" color="text.primary">
            {format(date, 'yyyy年M月')}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: { xs: 'none', sm: 'inline-block' }
          }}
        >
          {viewOptions.map((viewOption) => {
            const Icon = viewOption.icon;

            return (
              <Tooltip
                key={viewOption.value}
                arrow
                placement="top"
                title={t(viewOption.label)}
              >
                <IconButton
                  color={viewOption.value === view ? 'primary' : 'secondary'}
                  onClick={() => changeView(viewOption.value)}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          })}
        </Grid>
      </Grid>
    );
  }
);

export default Actions;
