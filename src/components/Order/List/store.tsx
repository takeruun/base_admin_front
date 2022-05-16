import { useState, ChangeEvent } from 'react';
import { useOrder } from 'src/hooks/useOrder';
import { useSearch } from 'src/hooks/useSearch';

export const useListState = () => {
  const { orders, totalOrderCount, getOrders, deleteOrder } = useOrder();
  const { query, handleQueryChange } = useSearch();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeletedId] = useState(0);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

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
