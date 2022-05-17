import { VFC, memo } from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import numeral from 'numeral';
import { ListBodyPropsType } from './types';

const ListBody: VFC<ListBodyPropsType> = memo(
  ({ orders, handleSetDeleteId, handleConfirmDelete }) => {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return (
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
                        {order.customer.familyName} {order.customer.givenName}
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
                      {format(new Date(order.dateOfVisit), 'MM月dd日 H時mm分')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {format(new Date(order.createdAt), 'MM月dd日 H時mm分')}
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
                            handleSetDeleteId(order.id);
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
    );
  }
);

export default ListBody;
