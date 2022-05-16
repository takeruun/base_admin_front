import { useState } from 'react';
import { useCategory } from 'src/hooks/useCategory';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { getCategories, deleteCategory, categories, totalCategoryCount } =
    useCategory();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [deleteId, setDeletedId] = useState<number>(0);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    deleteCategory(deleteId, () => {
      setOpenConfirmDelete(false);
    });
  };

  const store = {
    categories,
    totalCategoryCount,
    page,
    limit,
    query,
    openConfirmDelete,

    setDeletedId,
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
