import { VFC, memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
  Typography,
  lighten,
  Zoom,
  styled
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useOrderCalendar } from 'src/hooks/useOrderCalendar';
import type { OrderEvent } from 'src/models/calendar';

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.error.lighter};
    color: ${theme.colors.error.main};

    &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
    }
`
);

const CardActionsWrapper = styled(Card)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    box-shadow: none;
    margin: 0 ${theme.spacing(3)};
`
);

interface AddEditEventModalProps {
  event: OrderEvent;
  onCancel?: () => void;
  onDeleteComplete?: () => void;
}

const EventDrawer: VFC<AddEditEventModalProps> = memo(
  ({ event, onCancel, onDeleteComplete }) => {
    const { t }: { t: any } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { deleteOrderCalendar } = useOrderCalendar();

    const handleDelete = async (): Promise<void> => {
      try {
        deleteOrderCalendar(event.id);
        onDeleteComplete();

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

    return (
      <Box sx={{ width: { sm: '400px' } }}>
        <Box p={3}>
          <Typography variant="h4">{t('Edit calendar event')}</Typography>
        </Box>
        <Divider />
        <Box px={3} py={2} sx={{ width: '90%', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('Customer name')}:
            </Typography>
            <Typography>{event.title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('Description')}:
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {event.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('Reservation Date')}:
            </Typography>
            <Typography>{format(new Date(event.start), 'M月d日')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('Reservation start time')}:
            </Typography>
            <Typography>{format(new Date(event.start), 'H時mm分')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('Reservation end time')}:
            </Typography>
            <Typography>{format(new Date(event.end), 'H時mm分')}</Typography>
          </Box>
        </Box>
        <CardActionsWrapper
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1
          }}
        >
          <Box>
            <Tooltip arrow title={t('Delete this calendar')}>
              <IconButtonError onClick={() => handleDelete()}>
                <DeleteTwoToneIcon />
              </IconButtonError>
            </Tooltip>
          </Box>
          <Box>
            <Button
              variant="outlined"
              sx={{
                mr: 1
              }}
              color="secondary"
              onClick={onCancel}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              startIcon={false ? <CircularProgress size="1rem" /> : null}
              disabled={false}
              color="primary"
              onClick={() => navigate(`/dashboards/orders/edit/${event.id}`)}
            >
              {t('Edit order')}
            </Button>
          </Box>
        </CardActionsWrapper>
      </Box>
    );
  }
);

EventDrawer.propTypes = {
  // @ts-ignore
  event: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func
};

EventDrawer.defaultProps = {
  onCancel: () => {},
  onDeleteComplete: () => {}
};

export default EventDrawer;
