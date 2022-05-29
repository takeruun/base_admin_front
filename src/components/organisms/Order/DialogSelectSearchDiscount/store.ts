import { useState } from 'react';
import { useAllDiscounts } from 'src/hooks/useDiscount';
import { usePagination } from 'src/hooks/usePagination';

export const useDialogSelectSearchDiscount = () => {
  const [formValue, setFormValue] = useState(null);
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const { getDiscounts, totalCount, discounts } = useAllDiscounts();

  const handleSetFromValue = (value: string) => setFormValue(value);

  const store = {
    page,
    limit,
    discounts,
    totalCount,

    getDiscounts,
    handleSetFromValue,
    handlePageChange,
    handleLimitChange
  };

  return store;
};
