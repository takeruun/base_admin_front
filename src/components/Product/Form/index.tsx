import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
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
import { useProductForm } from './store';

const Form = () => {
  const { t }: { t: any } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
    categories,

    getCategories
  } = useProductForm();

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
};

export default Form;
