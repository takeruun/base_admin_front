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
    courses,
    totalCourseCount,
    page,
    limit,
    query,
    openConfirmDelete,

    handleSetDeleteId,
    getCourses,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  } = useList();

  useEffect(() => {
    getCourses({ product_type: 1, offset: page * limit, limit });
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
            placeholder={t('Search by course name')}
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Divider />

        {courses.length === 0 ? (
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
              {t("We couldn't find any courses matching your search criteria")}
            </Typography>
          </>
        ) : (
          <>
            <ListBody
              courses={courses}
              handleConfirmDelete={handleConfirmDelete}
              handleSetDeleteId={handleSetDeleteId}
            />
            <Box p={2}>
              <Pagination
                count={totalCourseCount}
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
          'Are you sure you want to permanently delete this course'
        )}？`}
        alertButtomMessage={t('Delete')}
      />
    </>
  );
};

export default List;
