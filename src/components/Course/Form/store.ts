import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from 'src/hooks/useRequest';
import { useCategory } from 'src/hooks/useCategory';
import { FormInputType } from './types';

export const useCourseForm = () => {
  const navigate = useNavigate();
  const { t }: { t: any } = useTranslation();
  const { categories, getCategories } = useCategory();

  const schema = Yup.object({
    categoryId: Yup.number().required(t('Need select category.')),
    name: Yup.string().required(t('Product name is required.')),
    price: Yup.number()
      .min(1, t('Must be a number greater than or equal to 1.'))
      .required(t('Price is required.'))
  }).required();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      courseName: '',
      categoryId: 0,
      name: '',
      price: 0
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: FormInputType) => {
    try {
      request({
        url: '/v1/products',
        method: 'POST',
        reqParams: {
          data: {
            productType: 'コース',
            categoryId: data.categoryId,
            name: data.name,
            price: data.price
          }
        }
      }).then(() => {
        navigate('/dashboards/courses');
      });
    } catch (e) {
      console.error(e);
    }
  };

  const store = {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
    categories,

    getCategories
  };

  return store;
};
