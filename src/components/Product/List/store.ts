import { useState, useCallback } from 'react';
import { useProduct } from 'src/hooks/useProduct';
import { useSearch } from 'src/hooks/useSearch';
import { usePagination } from 'src/hooks/usePagination';

export const useList = () => {
  const { getProductsSearch, deleteProduct, totalProductCount, products } =
    useProduct();
  const { query, handleQueryChange } = useSearch();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [deleteId, setDeleteId] = useState<number>(0);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = useCallback(() => setOpenConfirmDelete(true), []);
  const closeConfirmDelete = useCallback(() => setOpenConfirmDelete(false), []);

  const handleSetDeleteId = useCallback(
    (deleteId: number) => setDeleteId(() => deleteId),
    []
  );

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

    handleSetDeleteId,
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
