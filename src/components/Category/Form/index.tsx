import { useTranslation } from 'react-i18next';
import {
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
import { useCategoryForm } from './store';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const Form = () => {
  const { t }: { t: any } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },

    onSubmit
  } = useCategoryForm();

  return (
    <>
      <Card
        sx={{
          width: '50%'
        }}
      >
        <CardHeader title={t('Category info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormLabelStyle>{t('Category name')}</FormLabelStyle>
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
                {t('Add new category')}
              </Button>
            </DialogActions>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form;
