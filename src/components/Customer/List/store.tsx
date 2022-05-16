import { useState } from 'react';
import { useCustomer } from 'src/hooks/useCustomer';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useListState = () => {
  const { customers, totalCustomerCount, getCustomers, deleteCustomer } =
    useCustomer();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeletedId] = useState<number>(0);

  const handleConfirmDelete = () => setOpenConfirmDelete(true);

  const closeConfirmDelete = () => setOpenConfirmDelete(false);

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    deleteCustomer(deleteId);
  };

  const store = {
    customers,
    totalCustomerCount,
    page,
    limit,
    query,
    openConfirmDelete,

    getCustomers,
    setDeletedId,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  };

  return store;
};
