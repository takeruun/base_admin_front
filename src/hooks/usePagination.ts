import { useState, useCallback, ChangeEvent } from 'react';

export const usePagination = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePageChange = useCallback(
    (_: any, newPage: number) => setPage(newPage),
    []
  );

  const handleLimitChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setLimit(parseInt(event.target.value)),
    []
  );

  return { page, limit, handlePageChange, handleLimitChange };
};
