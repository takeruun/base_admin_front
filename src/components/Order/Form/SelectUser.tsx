import { useState, useEffect, ChangeEvent, FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  InputAdornment,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TextField,
  Typography,
  styled
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useTranslation } from 'react-i18next';

import { useAllUsers } from 'src/hooks/useUser';
import { OrderFormInputType } from './index';
import type { User } from 'src/models/user';

const UnderLineTypography = styled(Typography)(
  () => `
    text-decoration: underline;
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
`
);

const SelectUser: FC = () => {
  const { t }: { t: any } = useTranslation();
  const { setValue, getValues } = useFormContext<OrderFormInputType>();

  const [open, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const { getUsers, totalCount, users } = useAllUsers();

  const handleClose = () => setOpen(false);

  const handleSelecUser = (user: User) => {
    setValue('userId', user.id);
    setValue('user.id', user.id);
    setValue('user.familyName', user.familyName);
    setValue('user.givenName', user.givenName);
    setValue('user.familyNameKana', user.familyNameKana);
    setValue('user.givenNameKana', user.givenNameKana);
    setValue('user.postalCode', user.postalCode);
    setValue('user.prefecture', user.prefecture);
    setValue('user.address1', user.address1);
    setValue('user.address2', user.address2);
    setValue('user.address3', user.address3);
    setValue('user.phoneNumber', user.phoneNumber);
    setValue('user.homePhoneNumber', user.homePhoneNumber);
    setValue('user.email', user.email);
    setValue('user.gender', user.gender);
    setValue('user.birthday', user.birthday);
    setValue('user.occupation', user.occupation);
    setValue('user.firstVisitDate', user.firstVisitDate);
    setValue('user.memo', user.memo ? user.memo : '');
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  useEffect(() => {
    getUsers({ offset: page * limit, limit });
  }, [getUsers]);

  return (
    <>
      <Typography noWrap variant="subtitle2">
        {getValues('user.familyNameKana')}
        {getValues('user.givenNameKana')}
      </Typography>
      <UnderLineTypography noWrap variant="h3" onClick={() => setOpen(true)}>
        {Boolean(getValues('userId'))
          ? `
              ${getValues('user.familyName')}
              ${getValues('user.givenName')}
              `
          : 'お客様選択'}
      </UnderLineTypography>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" gutterBottom>
            {t('Select customer')}
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3,
            pb: 0
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  m: 0
                }}
                onChange={(e) => setFormValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          getUsers({ offset: page * limit, limit })
                        }
                      >
                        {t('Search')}
                      </Button>
                    </InputAdornment>
                  )
                }}
                placeholder={t('Search by user name')}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('Customer id')}</TableCell>
                        <TableCell>{t('Customer name')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => {
                        return (
                          <TableRow
                            hover
                            key={user.id}
                            onClick={() => {
                              handleSelecUser(user);
                              handleClose();
                            }}
                          >
                            <TableCell>
                              <Typography noWrap>{user.id}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography noWrap variant="h5">
                                {user.familyName} {user.givenName}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box>
                  <TablePagination
                    component="div"
                    count={totalCount}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 15]}
                    labelRowsPerPage={t('Rows per page')}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectUser;
