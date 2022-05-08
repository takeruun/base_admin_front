import { FC } from 'react';
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
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import request from 'src/hooks/useRequest';
import { useNavigate } from 'react-router-dom';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

type FormInputType = {
  name: string;
  password: string;
  email: string;
};

const Form: FC = () => {
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
          data: {
            ...data
          }
        }
      }).then(() => {
        navigate('/dashboards/administrators');
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: '100%'
        }}
      >
        <CardHeader title={t('Administrator info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormLabelStyle>{t('Administrator name')}</FormLabelStyle>
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
                  <FormLabelStyle>{t('Email')}</FormLabelStyle>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabelStyle>{t('Password')}</FormLabelStyle>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
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
                {t('Add new administrator')}
              </Button>
            </DialogActions>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form;
