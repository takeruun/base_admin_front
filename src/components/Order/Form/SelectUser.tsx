import { useEffect, VFC } from 'react';
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

import { useSelectCustomerState } from './store';

const UnderLineTypography = styled(Typography)(
  () => `
    text-decoration: underline;
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
`
);

const SelectUser: VFC = () => {
  const { t }: { t: any } = useTranslation();
  const {
    getValues,
    open,
    formValue,
    page,
    limit,
    customers,
    totalCostomerCount,

    getCustomers,
    handleSetFromValue,
    handleOpen,
    handleClose,
    handleSelectUser,
    handlePageChange,
    handleLimitChange
  } = useSelectCustomerState();

  useEffect(() => {
    getCustomers({ offset: page * limit, limit });
  }, [page, limit]);

  return (
    <>
      <Typography noWrap variant="subtitle2">
        {getValues('user.familyNameKana')}
        {getValues('user.givenNameKana')}
      </Typography>
      <UnderLineTypography noWrap variant="h3" onClick={handleOpen}>
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
                onChange={(e) => handleSetFromValue(e.target.value)}
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
                          getCustomers({ offset: page * limit, limit })
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
                      {customers.map((user) => {
                        return (
                          <TableRow
                            hover
                            key={user.id}
                            onClick={() => {
                              handleSelectUser(user);
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
                    count={totalCostomerCount}
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
