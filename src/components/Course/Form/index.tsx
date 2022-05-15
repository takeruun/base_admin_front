import { useEffect } from 'react';
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
import { Controller } from 'react-hook-form';
import { useCourseForm } from './store';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
    categories,

    getCategories
  } = useCourseForm();
  const { t }: { t: any } = useTranslation();

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
