import { useEffect } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Pagination from 'src/components/molecule/Pagination';
import Search from 'src/components/molecule/Search';
import AlertDialog from 'src/components/molecule/AlertDialog';
import ListBody from './ListBody';
import { useList } from './store';

const List = () => {
  const { t }: { t: any } = useTranslation();
  const {
    administrators,
    totalAdministratorCount,
    page,
    limit,
    query,
    openConfirmDelete,

    getAdministrators,
    handleSetDeleteId,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useList();

  useEffect(() => {
    getAdministrators({ offset: page * limit, limit });
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
              getAdministrators({
                query,
                offset: page * limit,
                limit
              })
            }
            onChange={handleQueryChange}
            placeholder={t('Search by administrator name')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Divider />

        {administrators.length === 0 ? (
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
                "We couldn't find any administrators matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <ListBody
              administrators={administrators}
              handleConfirmDelete={handleConfirmDelete}
              handleSetDeleteId={handleSetDeleteId}
            />
            <Box p={2}>
              <Pagination
                count={totalAdministratorCount}
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
          'Are you sure you want to permanently delete this administrator'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
