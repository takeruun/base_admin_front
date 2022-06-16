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
    orders,
    totalOrderCount,
    page,
    limit,
    query,
    openConfirmDelete,

    handleSetDeleteId,
    getOrders,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useListState();

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
            search={() => getOrders(page, limit)}
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
            <ListBody
              orders={orders}
              handleSetDeleteId={handleSetDeleteId}
              handleConfirmDelete={handleConfirmDelete}
            />
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

      <AlertDialog
        open={openConfirmDelete}
        onClose={closeConfirmDelete}
        handleAlertDone={handleDeleteCompleted}
        mode={'error'}
        alertMainMessage={`${t(
          'Are you sure you want to permanently delete this order'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
