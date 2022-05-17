import { useEffect } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Search from 'src/components/molecule/Search';
import Pagination from 'src/components/molecule/Pagination';
import AlertDialog from 'src/components/molecule/AlertDialog';
import ListBody from './ListBody';
import { useList } from './store';

const List = () => {
  const { t }: { t: any } = useTranslation();
  const {
    categories,
    totalCategoryCount,
    page,
    limit,
    query,
    openConfirmDelete,

    handleSetDeleteId,
    getCategories,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useList();

  useEffect(() => {
    getCategories({
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
            onChange={handleQueryChange}
            placeholder={t('Search by category name')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Divider />

        {categories.length === 0 ? (
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
                "We couldn't find any categories matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <ListBody
              categories={categories}
              handleConfirmDelete={handleConfirmDelete}
              handleSetDeleteId={handleSetDeleteId}
            />
            <Box p={2}>
              <Pagination
                count={totalCategoryCount}
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
          'Are you sure you want to permanently delete this category'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
