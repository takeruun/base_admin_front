import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Button, TextField, Link, CircularProgress } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

type LoginInputType = {
  email: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required()
});

const LoginJWT: FC = () => {
  const { login } = useAuth() as any;
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields }
  } = useForm<LoginInputType>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: LoginInputType) => {
    try {
      await login(data.email, data.password);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              label={t('Email')}
              fullWidth
              type="email"
              variant="outlined"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              label={t('Password')}
              fullWidth
              type="password"
              variant="outlined"
            />
          )}
        />
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Link component={RouterLink} to="/account/recover-password">
            <b>{t('Lost password?')}</b>
          </Link>
        </Box>
        <Button
          sx={{
            mt: 3
          }}
          color="primary"
          startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
          disabled={isSubmitting}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
        >
          {t('Sign in')}
        </Button>
      </form>
    </>
  );
};

export default LoginJWT;
