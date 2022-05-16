import { ChangeEvent, useState } from 'react';
import { useProduct } from 'src/hooks/useProduct';
import { useSearch } from 'src/hooks/useSearch';

export const useList = () => {
  const { getProductsSearch, deleteProduct, totalProductCount, products } =
    useProduct();
  const { query, handleQueryChange } = useSearch();
  const [deleteId, setDeletedId] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

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
