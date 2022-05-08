import { FC, useState, ChangeEvent, useEffect, memo } from 'react';
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
import { useAllUsers } from 'src/hooks/useUser';

interface SelectUserDialogPropsType {
  handleSelectUser: (userId: number) => void;
  handleCloseDialog: () => void;
  handleSetUserName: (userName: string) => void;
}

const SelectUserDialog: FC<SelectUserDialogPropsType> = memo(
  ({ handleSelectUser, handleCloseDialog, handleSetUserName }) => {
    const { t }: { t: any } = useTranslation();
    const { getUsers, totalCount, users } = useAllUsers();
    const [formValue, setFormValue] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const handlePageChange = (_event: any, newPage: number): void => {
      setPage(newPage);
    };
    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setLimit(parseInt(event.target.value));
    };

    useEffect(() => {
      getUsers({ offset: page * limit, limit });
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
                            handleSelectUser(user.id);
                            handleSetUserName(
                              `${user.familyName}${user.givenName}`
                            );
                            handleCloseDialog();
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
            </Grid>
          </Grid>
        </DialogContent>
      </>
    );
  }
);

export default SelectUserDialog;
