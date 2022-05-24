import { useState, useCallback } from 'react';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';
import { useAdministrator } from 'src/hooks/useAdministrator';

export const useList = () => {
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const { query, handleQueryChange } = useSearch();
  const {
    administrators,
    totalAdministratorCount,
    getAdministrators,
    deleteAdministrator
  } = useAdministrator();
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
    deleteAdministrator(deleteId);
  }, [deleteId]);

  const store = {
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
  };

  return store;
};
