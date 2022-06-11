import { useEffect } from 'react';
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
  Typography,
  InputAdornment,
  styled
} from '@mui/material';
import { useProductForm } from './store';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

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
          width: '50%'
        }}
      >
        <CardHeader title={t('Product info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
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
                <FormLabelStyle>{t('Product name')}</FormLabelStyle>
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
                      InputProps={{
                        inputProps: {
                          style: { textAlign: 'right' }
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              p={0}
                              m={0}
                              variant="body1"
                              sx={{
                                lineHeight: 0
                              }}
                            >
                              ¥
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                p: 2,
                pb: 0
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
