import { useState, useCallback } from 'react';
import { useCustomer } from 'src/hooks/useCustomer';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useListState = () => {
  const { customers, totalCustomerCount, getCustomers, deleteCustomer } =
    useCustomer();
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
    deleteCustomer(deleteId);
  }, [deleteId]);

  const store = {
    customers,
    totalCustomerCount,
    page,
    limit,
    query,
    openConfirmDelete,

    getCustomers,
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
