import { VFC, memo } from 'react';
import {
  Box,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { ListBodyPropsType } from './types';

const ListBody: VFC<ListBodyPropsType> = memo(
  ({ customers, handleConfirmDelete, handleSetDeleteId }) => {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Customer id')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>{t('Name')}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Address')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Phone number')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Next reservation day')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Number of days since last visit')}
                </Typography>
              </TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              return (
                <TableRow hover key={customer.id}>
                  <TableCell>
                    <Typography noWrap align="center">
                      {customer.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          sx={{ fontSize: 12 }}
                        >
                          {customer.familyNameKana} {customer.givenNameKana}
                        </Typography>
                        <Typography noWrap variant="h5">
                          {customer.familyName} {customer.givenName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {customer.address1}
                      {customer.address2}
                      {customer.address3}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{customer.phoneNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {customer.nextVisitDate
                        ? format(
                            new Date(customer.nextVisitDate),
                            'MM月dd日 H時mm分'
                          )
                        : '予約なし'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap align="center">
                      {customer.lastVistDates}日
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap>
                      <Tooltip title={t('Edit customer')} arrow>
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
                            navigate(`edit/${customer.id}`);
                          }}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('Delete')} arrow>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDeleteId(customer.id);
                            handleConfirmDelete();
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
