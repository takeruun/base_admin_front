import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import request from 'src/hooks/useRequest';
import { FormInputType } from './types';

export const useAdministratorForm = () => {
  const navigate = useNavigate();
  const { t }: { t: any } = useTranslation();

  const schema = Yup.object({
    name: Yup.string().required(t('Administrator name is required.')),
    email: Yup.string().required(t('Email is required.')),
    password: Yup.string().required(t('Password is required.'))
  }).required();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      name: '',
      password: '',
      email: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: FormInputType) => {
    try {
      request({
        url: '/v1/administrators',
        method: 'POST',
        reqParams: {
          data
        }
      }).then(() => {
        navigate('/dashboards/administrators');
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
