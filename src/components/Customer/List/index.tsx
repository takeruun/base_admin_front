import { useEffect } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Search from 'src/components/molecule/Search';
import Pagination from 'src/components/molecule/Pagination';
import AlertDialog from 'src/components/molecule/AlertDialog';
import ListBody from './ListBody';
import { useListState } from './store';

const List = () => {
  const { t }: { t: any } = useTranslation();
  const {
    customers,
    totalCustomerCount,
    page,
    limit,
    query,
    openConfirmDelete,

    getCustomers,
    handleSetDeleteId,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useListState();

  useEffect(() => {
    getCustomers({
      offset: page * limit,
      limit
    });
  }, [page, limit]);

  return (
    <>
      <Card>
        <Box p={2}>
          <Search
            sx={{
              m: 0
            }}
            search={() =>
              getCustomers({
                query,
                offset: page * limit,
                limit
              })
            }
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

        {customers.length === 0 ? (
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
              {t(
                "We couldn't find any customers matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <ListBody
              customers={customers}
              handleConfirmDelete={handleConfirmDelete}
              handleSetDeleteId={handleSetDeleteId}
            />
            <Box p={2}>
              <Pagination
                count={totalCustomerCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
              />
            </Box>
          </>
        )}
      </Card>
      <AlertDialog
        open={openConfirmDelete}
        onClose={closeConfirmDelete}
        handleAlertDone={handleDeleteCompleted}
        mode={'error'}
        alertMainMessage={`${t(
          'Are you sure you want to permanently delete this customer account'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
