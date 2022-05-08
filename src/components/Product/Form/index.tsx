import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
  Box
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import request from 'src/hooks/useRequest';
import { Category } from 'src/models/category';

type FormInputType = {
  courseName: string;
  categoryId: number;
  name: string;
  price: number;
};

function Form() {
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
            productType: '商品',
            categoryId: data.categoryId,
            name: data.name,
            price: data.price
          }
        }
      }).then(() => {
        navigate('/dashboards/products');
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getCategories = useCallback(async () => {
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
        <CardHeader title={t('Product info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box pb={0} pt={0} sx={{ fontWeight: 'bold' }}>
                    <p>{t('Category')}</p>
                  </Box>
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
                        {...params}
                        error={Boolean(errors.categoryId)}
                        helperText={errors.categoryId?.message}
                        {...register('courseName')}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box pb={0} pt={0} sx={{ fontWeight: 'bold' }}>
                    <p>{t('Product name')}</p>
                  </Box>
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
                  <Box pb={0} pt={0} sx={{ fontWeight: 'bold' }}>
                    <p>{t('Price')}</p>
                  </Box>
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
                {t('Add new product')}
              </Button>
            </DialogActions>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default Form;
