import { useState, useCallback, ChangeEvent } from 'react';

export const useSearch = () => {
  const [query, setQuery] = useState<string>('');

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist();
      setQuery(() => event.target.value);
    },
    []
  );

  return { query, handleQueryChange };
};
