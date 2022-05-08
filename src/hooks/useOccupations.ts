import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';

export const useOccupations = () => {
  const [occupations, setOccupations] = useState([]);

  const getOccupations = useCallback(() => {
    try {
      request({
        url: '/v1/master/occupations',
        method: 'GET'
      }).then((response) => {
        setOccupations(response.data.occupations);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getOccupations, occupations };
};
