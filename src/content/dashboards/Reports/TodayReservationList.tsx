import { useEffect, useState, ChangeEvent, Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Divider,
  Dialog,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
  styled
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { format } from 'date-fns';
import type { Status } from 'src/models/order';
import Scrollbar from 'src/components/Scrollbar';
import { useOrder } from 'src/hooks/useOrder';
import { useOrderState } from 'src/contexts/OrderContext';
import UpdateOrderForm from './UpdateOrderForm';

const LabelComplete = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    background: ${theme.colors.success.lighter};
    color: ${theme.colors.success.main};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(11)};
    font-weight: bold;
    padding: ${theme.spacing(1, 2)};
    border-radius: ${theme.general.borderRadiusSm};
  `
);

const LabelCancel = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    background: ${theme.colors.error.lighter};
    color: ${theme.colors.error.main};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(11)};
    font-weight: bold;
    padding: ${theme.spacing(1, 2)};
    border-radius: ${theme.general.borderRadiusSm};
  `
);

const LabelReservation = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    background: ${theme.colors.warning.lighter};
    color: ${theme.colors.warning.main};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(11)};
    font-weight: bold;
    padding: ${theme.spacing(1, 2)};
    border-radius: ${theme.general.borderRadiusSm};
  `
);

const ListItemWrapper = styled(ListItem)(
  () => `
    &:hover {
        background: #eeeeee;
    }
  `
);

const getOrderStatusLabel = (status: Status) => {
  if (status === '完了') return <LabelComplete>{status}</LabelComplete>;
  else if (status === '予約')
    return <LabelReservation>{status}</LabelReservation>;
  else if (status === 'キャンセル') return <LabelCancel>{status}</LabelCancel>;
};

const TodayReservationList = () => {
  const { t }: { t: any } = useTranslation();
  const { orders } = useOrderState();
  const { getTodayReservationOrders } = useOrder();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');

  const [orderInfo, setOrderInfo] =
    useState<{ orderId: number; name: string; phoneNumber: string }>();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  useEffect(() => {
    getTodayReservationOrders(page, limit);
  }, [page, limit]);

  return (
    <>
      <Card>
        <Box p={2}>
          <TextField
            sx={{
              m: 0
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder={t('Search by name, email or phone number...')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
        <Divider />
        <Divider />
        {orders.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t('No reservations for today')}
            </Typography>
          </>
        ) : (
          <Box
            sx={{
              height: { xs: 242, sm: 215 }
            }}
          >
            <Scrollbar>
              <List disablePadding>
                {orders.map((order) => {
                  return (
                    <Fragment key={order.id}>
                      <ListItemWrapper
                        sx={{
                          justifyContent: 'space-between',
                          display: { xs: 'block', sm: 'flex' },
                          py: 2,
                          px: 2.5
                        }}
                        onClick={() => {
                          setOrderInfo({
                            orderId: order.id,
                            name: `${order.customer.familyName}${order.customer.givenName}`,
                            phoneNumber: order.customer.phoneNumber
                          });
                          handleOpen();
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{
                            flexGrow: 0,
                            maxWidth: '100%',
                            flexBasis: '20%'
                          }}
                        >
                          {`${order.customer.familyName} ${order.customer.givenName}`}
                        </Typography>
                        <Typography
                          sx={{
                            flexGrow: 1,
                            maxWidth: '100%',
                            flexBasis: '30%',
                            mt: { xs: 1, sm: 0 }
                          }}
                        >
                          {format(new Date(order.dateOfVisit), 'H:mm')} ~{' '}
                          {format(new Date(order.dateOfExit), 'H:mm')}
                        </Typography>
                        <Box display="flex" flexGrow={2} alignItems="center">
                          <Box display="flex" alignItems="center" flex={1}>
                            <Typography fontWeight="bold">
                              {order.orderItems[0].product.name}
                            </Typography>
                          </Box>
                          <Typography>
                            {getOrderStatusLabel(order.status)}
                          </Typography>
                        </Box>
                      </ListItemWrapper>
                      <Divider />
                    </Fragment>
                  );
                })}
              </List>
            </Scrollbar>
          </Box>
        )}
      </Card>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <UpdateOrderForm orderInfo={orderInfo} handleClose={handleClose} />
      </Dialog>
    </>
  );
};

export default TodayReservationList;
