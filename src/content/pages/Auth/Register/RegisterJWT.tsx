import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  FormControlLabel,
  Link,
  CircularProgress
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import request from 'src/hooks/useRequest';

type FormInputType = {
  email: string;
  name: string;
  password: string;
  terms: boolean;
};

const RegisterJWT = () => {
  const { t }: { t: any } = useTranslation();

  const schema = Yup.object({
    email: Yup.string()
      .email(t('The email provided should be a valid email address'))
      .max(255)
      .required(t('The email field is required')),
    name: Yup.string().max(255).required(t('The name field is required')),
    password: Yup.string()
      .min(8)
      .max(255)
      .required(t('The password field is required')),
    terms: Yup.boolean().oneOf(
      [true],
      t('You must agree to our terms and conditions')
    )
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      terms: false
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormInputType) => {
    try {
      request({
        url: '/v1/administrators',
        method: 'POST',
        reqParams: {
          data
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            error={Boolean(errors.name)}
            fullWidth
            margin="normal"
            helperText={errors.name?.message}
            label={t('Name')}
            name="name"
            variant="outlined"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            {...field}
            error={Boolean(errors.email)}
            fullWidth
            margin="normal"
            helperText={errors.email?.message}
            label={t('Email address')}
            name="email"
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
            fullWidth
            margin="normal"
            helperText={errors.password?.message}
            label={t('Password')}
            name="password"
            type="password"
            variant="outlined"
          />
        )}
      />
      <FormControlLabel
        control={
          <Controller
            control={control}
            name="terms"
            render={({ field }) => <Checkbox {...field} color="primary" />}
          />
        }
        label={
          <>
            <Typography variant="body2">
              {t('I accept the')}{' '}
              <Link component="a" href="#">
                {t('terms and conditions')}
              </Link>
              .
            </Typography>
          </>
        }
      />
      {Boolean(errors.terms) && (
        <FormHelperText error>{errors.terms?.message}</FormHelperText>
      )}
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
        {t('Create your account')}
      </Button>
    </form>
  );
};

export default RegisterJWT;
