import { useState } from 'react';
import { useOrder } from 'src/hooks/useOrder';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useListState = () => {
  const { orders, totalOrderCount, getOrders, deleteOrder } = useOrder();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [deleteId, setDeletedId] = useState(0);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => setOpenConfirmDelete(true);

  const closeConfirmDelete = () => setOpenConfirmDelete(false);

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    deleteOrder(deleteId);
  };

  const store = {
    orders,
    totalOrderCount,
    page,
    limit,
    query,
    openConfirmDelete,

    setDeletedId,
    getOrders,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  };

  return store;
};
