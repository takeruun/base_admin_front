import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import type { Discount } from 'src/models/discount';

export const useAllDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const getDiscounts = useCallback((params) => {
    try {
      request({
        url: `/v1/discounts`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setDiscounts(response.data.discounts);
          setTotalCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getDiscounts, totalCount, discounts };
};
