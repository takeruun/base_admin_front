import { ChangeEvent, useState } from 'react';
import { useCategory } from 'src/hooks/useCategory';
import { useSearch } from 'src/hooks/useSearch';

export const useList = () => {
  const { getCategories, deleteCategory, categories, totalCategoryCount } =
    useCategory();
  const { query, handleQueryChange } = useSearch();

  const [deleteId, setDeletedId] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

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
