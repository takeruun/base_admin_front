import { useState } from 'react';
import { useCourse } from 'src/hooks/useCourse';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { courses, totalCourseCount, getCourses, deleteCourse } = useCourse();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
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
