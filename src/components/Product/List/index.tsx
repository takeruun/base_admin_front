import { VFC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Divider, Typography } from '@mui/material';
import Search from 'src/components/molecule/Search';
import Pagination from 'src/components/molecule/Pagination';
import AlertDialog from 'src/components/molecule/AlertDialog';
import ListBody from './ListBody';
import { useList } from './store';

const List: VFC = () => {
  const { t }: { t: any } = useTranslation();
  const {
    totalProductCount,
    products,
    page,
    limit,
    query,
    openConfirmDelete,

    handleSetDeleteId,
    getProductsSearch,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useList();

  useEffect(() => {
    getProductsSearch({ product_type: 2, offset: page * limit, limit });
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
            placeholder={t('Search by product name')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Divider />

        {products.length === 0 ? (
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
              {t("We couldn't find any products matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <ListBody
              products={products}
              handleConfirmDelete={handleConfirmDelete}
              handleSetDeleteId={handleSetDeleteId}
            />
            <Box p={2}>
              <Pagination
                count={totalProductCount}
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
          'Are you sure you want to permanently delete this product'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
