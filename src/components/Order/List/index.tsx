import { ReactElement, Ref, forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  Slide,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Tooltip,
  Button,
  Typography,
  Dialog,
  styled,
  useTheme
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { format } from 'date-fns';
import numeral from 'numeral';
import Search from 'src/components/molecule/Search';
import Pagination from 'src/components/molecule/Pagination';
import { useListState } from './store';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
      background: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};

      &:hover {
        background: ${theme.colors.error.dark};
      }
    `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const List = () => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const {
    orders,
    totalOrderCount,
    page,
    limit,
    query,
    openConfirmDelete,

    setDeletedId,
    getOrders,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useListState();
  const navigate = useNavigate();

  useEffect(() => {
    getOrders(page, limit);
  }, [page, limit]);

  return (
    <>
      <Card>
        <Box p={2}>
          <Search
            sx={{
              m: 0
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
              {t("We couldn't find any orders matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography noWrap sx={{ fontWeight: 'bold' }}>
                        {t('Clute id')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Customer name')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Course')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 'bold' }}>
                        {t('Payment method')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 'bold' }}>
                        {t('Total price')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Visit day')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Resavertion day')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => {
                    return (
                      <TableRow
                        hover
                        key={order.id}
                        onClick={(e) => navigate(`${order.id}`)}
                      >
                        <TableCell align="center">
                          <Typography>{order.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap variant="h5">
                              {order.customer.familyName}{' '}
                              {order.customer.givenName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {order.orderItems[0]?.product?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>{order.paymentMethod}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            ¥{numeral(order.totalPrice).format('0,0')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {format(
                              new Date(order.dateOfVisit),
                              'MM月dd日 H時mm分'
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {format(
                              new Date(order.createdAt),
                              'MM月dd日 H時mm分'
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit order')} arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: theme.colors.primary.lighter
                                  },
                                  color: theme.palette.primary.main
                                }}
                                color="inherit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`edit/${order.id}`);
                                }}
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmDelete();
                                  setDeletedId(order.id);
                                }}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <Pagination
                count={totalOrderCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
              />
            </Box>
          </>
        )}
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Are you sure you want to permanently delete this order')}？
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Back')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default List;
