import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Zoom } from '@mui/material';
import request from 'src/hooks/useRequest';
import type { Administrator } from 'src/models/administrator';

export const useAdministrator = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [totalAdministratorCount, setTotalAdministratorCount] =
    useState<number>(0);

  const getAdministrators = useCallback((params) => {
    request({
      url: '/v1/administrators',
      method: 'GET',
      reqParams: {
        params
      }
    }).then((response) => {
      setAdministrators(response.data.admins);
      setTotalAdministratorCount(response.data.totalCount);
    });
  }, []);

  const deleteAdministrator = useCallback((deleteId: number) => {
    request({
      url: `/v1/administrators/${deleteId}`,
      method: 'DELETE'
    }).then(() => {
      setAdministrators((prev) => prev.filter((c) => c.id !== deleteId));
      enqueueSnackbar(t('The administrator has been removed'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });
  }, []);

  return {
    administrators,
    totalAdministratorCount,
    getAdministrators,
    deleteAdministrator
  };
};
