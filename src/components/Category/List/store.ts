import { useState, useCallback } from 'react';
import { useCategory } from 'src/hooks/useCategory';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { getCategories, deleteCategory, categories, totalCategoryCount } =
    useCategory();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [deleteId, setDeleteId] = useState<number>(0);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = useCallback(() => setOpenConfirmDelete(true), []);
  const closeConfirmDelete = useCallback(() => setOpenConfirmDelete(false), []);

  const handleSetDeleteId = useCallback(
    (deleteId: number) => setDeleteId(() => deleteId),
    []
  );

  const handleDeleteCompleted = useCallback(() => {
    deleteCategory(deleteId, () => {
      setOpenConfirmDelete(false);
    });
  }, [deleteId]);

  const store = {
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
  };

  return store;
};
