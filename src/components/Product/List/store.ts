import { useState } from 'react';
import { useProduct } from 'src/hooks/useProduct';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { getProductsSearch, deleteProduct, totalProductCount, products } =
    useProduct();
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
    setOpenConfirmDelete(false);
    deleteProduct(deleteId);
  };

  const store = {
    totalProductCount,
    products,
    page,
    limit,
    query,
    openConfirmDelete,

    setDeletedId,
    getProductsSearch,
    handleQueryChange,
    handlePageChange,
    handleLimitChange,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted
  };

  return store;
};
