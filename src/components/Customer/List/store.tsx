import { useState, ChangeEvent } from 'react';
import { useCustomer } from 'src/hooks/useCustomer';
import { useSearch } from 'src/hooks/useSearch';

export const useListState = () => {
  const { customers, totalCustomerCount, getCustomers, deleteCustomer } =
    useCustomer();
  const { query, handleQueryChange } = useSearch();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

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
