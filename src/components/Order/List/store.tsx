import { useState, useCallback } from 'react';
import { useOrder } from 'src/hooks/useOrder';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useListState = () => {
  const { orders, totalOrderCount, getOrders, deleteOrder } = useOrder();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [deleteId, setDeleteId] = useState(0);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = useCallback(() => setOpenConfirmDelete(true), []);
  const closeConfirmDelete = useCallback(() => setOpenConfirmDelete(false), []);

  const handleSetDeleteId = useCallback(
    (deleteId: number) => setDeleteId(() => deleteId),
    []
  );

  const handleDeleteCompleted = useCallback(() => {
    setOpenConfirmDelete(false);
    deleteOrder(deleteId);
  }, [deleteId]);

  const store = {
    orders,
    totalOrderCount,
    page,
    limit,
    query,
    openConfirmDelete,

    getOrders,
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
