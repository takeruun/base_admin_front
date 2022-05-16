import { VFC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination } from '@mui/material';
import { PaginationPropsType } from './types';

const Pagination: VFC<PaginationPropsType> = memo(
  ({
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions = [5, 10, 15]
  }) => {
    const { t }: { t: any } = useTranslation();
    return (
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage={t('Rows per page')}
      />
    );
  }
);

export default Pagination;
