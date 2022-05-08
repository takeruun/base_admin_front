import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';

export const usePrefectures = () => {
  const [prefectures, setPrefectures] = useState([]);

  const getPrefectures = useCallback(() => {
    try {
      request({
        url: '/v1/master/prefectures',
        method: 'GET'
      }).then((response) => {
        setPrefectures(response.data.prefectures);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getPrefectures, prefectures };
};
