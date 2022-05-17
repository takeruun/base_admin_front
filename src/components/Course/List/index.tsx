import { useEffect } from 'react';
import {
  Box,
  Card,
  Divider,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useTranslation } from 'react-i18next';
import Search from 'src/components/molecule/Search';
import Pagination from 'src/components/molecule/Pagination';
import AlertDialog from 'src/components/molecule/AlertDialog';
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

    setDeletedId,
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography noWrap sx={{ fontWeight: 'bold' }}>
                        {t('Course id')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Category name')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('Course name')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 'bold' }}>
                        {t('Price')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((product) => {
                    return (
                      <TableRow hover key={product.id}>
                        <TableCell align="center">
                          <Typography>{product.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>カット</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>{product.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>{product.price}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => {
                                  handleConfirmDelete();
                                  setDeletedId(product.id);
                                }}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
