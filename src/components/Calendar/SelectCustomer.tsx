import { VFC, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  InputAdornment
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSelectCustomerState } from './store';

interface SelectCustomerPropsType {
  handleSelectCustomer: (customerId: number) => void;
  handleCloseDialog: () => void;
  handleSetUserName: (userName: string) => void;
}

const SelectCustomer: VFC<SelectCustomerPropsType> = memo(
  ({ handleSelectCustomer, handleCloseDialog, handleSetUserName }) => {
    const { t }: { t: any } = useTranslation();
    const {
      customers,
      totalCustomerCount,
      query,
      page,
      limit,

      setQuery,
      getCustomers,
      handlePageChange,
      handleLimitChange
    } = useSelectCustomerState();

    useEffect(() => {
      getCustomers({ offset: page * limit, limit });
    }, [page, limit]);

    return (
      <>
        <DialogTitle>
          <Typography variant="h4" gutterBottom>
            {t('Select customer')}
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  m: 0
                }}
                onChange={(e) => setQuery(e.target.value)}
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
                          getCustomers({ offset: page * limit, limit, query })
                        }
                      >
                        {t('Search')}
                      </Button>
                    </InputAdornment>
                  )
                }}
                placeholder={t('Search by customer name')}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Customer id')}</TableCell>
                      <TableCell>{t('Customer name')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => {
                      return (
                        <TableRow
                          hover
                          key={customer.id}
                          onClick={() => {
                            handleSelectCustomer(customer.id);
                            handleSetUserName(
                              `${customer.familyName}${customer.givenName}`
                            );
                            handleCloseDialog();
                          }}
                        >
                          <TableCell>
                            <Typography noWrap>{customer.id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {customer.familyName} {customer.givenName}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalCustomerCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
                labelRowsPerPage={t('Rows per page')}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </>
    );
  }
);

export default SelectCustomer;
