import { useState, ChangeEvent } from 'react';
import { useCustomer } from 'src/hooks/useCustomer';

export const useListState = () => {
  const { customers, totalCostomerCount, getCustomers, deleteCustomer } =
    useCustomer();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

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
    totalCostomerCount,
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
