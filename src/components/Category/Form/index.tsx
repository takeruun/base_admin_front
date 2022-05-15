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
  Box
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useFormState } from './store';

const Form = () => {
  const { t }: { t: any } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },

    onSubmit
  } = useFormState();

  return (
    <>
      <Card
        sx={{
          width: '100%'
        }}
      >
        <CardHeader title={t('Category info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box pb={0} pt={0} sx={{ fontWeight: 'bold' }}>
                    <p>{t('Category name')}</p>
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
