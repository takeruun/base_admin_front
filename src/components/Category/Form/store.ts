import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import request from 'src/hooks/useRequest';
import type { FormInputType } from './types';

export const useCategoryForm = () => {
  const navigate = useNavigate();
  const { t }: { t: any } = useTranslation();

  const schema = Yup.object({
    name: Yup.string().required(t('Category name is required.'))
  }).required();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: FormInputType) => {
    try {
      request({
        url: '/v1/categories',
        method: 'POST',
        reqParams: {
          data: {
            name: data.name
          }
        }
      }).then(() => {
        navigate('/dashboards/categories');
      });
    } catch (e) {
      console.error(e);
    }
  };

  const store = {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },

    onSubmit
  };

  return store;
};
