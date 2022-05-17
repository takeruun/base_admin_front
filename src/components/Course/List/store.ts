import { useState, useCallback } from 'react';
import { useCourse } from 'src/hooks/useCourse';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { courses, totalCourseCount, getCourses, deleteCourse } = useCourse();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const handleConfirmDelete = useCallback(() => setOpenConfirmDelete(true), []);

  const closeConfirmDelete = useCallback(() => setOpenConfirmDelete(false), []);

  const handleSetDeleteId = useCallback(
    (deleteId: number) => setDeleteId(() => deleteId),
    []
  );

  const handleDeleteCompleted = useCallback(() => {
    setOpenConfirmDelete(false);
    deleteCourse(deleteId);
  }, [deleteId]);

  const store = {
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
  };

  return store;
};
