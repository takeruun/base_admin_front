import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
  DialogActions,
  Grid,
  TextField,
  styled
} from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import request from 'src/hooks/useRequest';
import { Category } from 'src/models/category';
import { useNavigate } from 'react-router-dom';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

type FormInputType = {
  courseName: string;
  categoryId: number;
  name: string;
  price: number;
};

const Form: FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const { t }: { t: any } = useTranslation();

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

  const getCategories = useCallback(() => {
    try {
      request({
        url: '/v1/categories',
        method: 'GET'
      }).then((response) => {
        setCategories(response.data.categories);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <>
      <Card
        sx={{
          width: '100%'
        }}
      >
        <CardHeader title={t('Course info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormLabelStyle>{t('Category')}</FormLabelStyle>
                  <Autocomplete
                    disablePortal
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, v) => {
                      if (v) {
                        setValue('categoryId', v['id']);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register('courseName')}
                        error={Boolean(errors.courseName)}
                        helperText={errors.courseName?.message}
                        fullWidth
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabelStyle>{t('Course name')}</FormLabelStyle>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabelStyle>{t('Price')}</FormLabelStyle>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        error={Boolean(errors.price)}
                        helperText={errors.price?.message}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                p: 3
              }}
            >
              <Button color="secondary">{t('Cancel')}</Button>
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="contained"
              >
                {t('Add new course')}
              </Button>
            </DialogActions>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form;
