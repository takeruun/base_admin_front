import { ChangeEvent, useState } from 'react';
import { useCourse } from 'src/hooks/useCourse';
import { useSearch } from 'src/hooks/useSearch';

export const useList = () => {
  const { courses, totalCourseCount, getCourses, deleteCourse } = useCourse();
  const { query, handleQueryChange } = useSearch();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeletedId] = useState<number>(0);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    deleteCourse(deleteId);
  };

  const store = {
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
  };

  return store;
};
