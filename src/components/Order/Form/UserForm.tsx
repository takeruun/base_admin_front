import { VFC, useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import {
  Autocomplete,
  CardContent,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { IMaskInput } from 'react-imask';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ja from 'date-fns/locale/ja';

import { useUserFormState } from './store';

const FormLabelStyle = styled('p')(
  () => `
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: bold;
  `
);

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

const PostalCodeMask = forwardRef<HTMLInputElement, CustomProps>(
  function PostalCodeMask(props, ref) {
    const { onChange, value, ...other } = props;

    return (
      <IMaskInput
        {...other}
        mask="#00-0000"
        definitions={{
          '#': /[0-9]/
        }}
        inputRef={ref}
        value={value}
        onAccept={(value: any) => {
          onChange({ target: { name: props.name, value } });
        }}
        overwrite
      />
    );
  }
);

const UserForm: VFC = () => {
  const { t }: { t: any } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },

    prefectures,
    occupations,
    getPrefectures,
    getOccupations,
    updateAddress
  } = useUserFormState();

  useEffect(() => {
    getPrefectures();
    getOccupations();
  }, []);

  useEffect(() => {
    const subscription = updateAddress();
    return () => subscription.unsubscribe();
  }, [updateAddress]);

  return (
    <CardContent>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <FormLabelStyle>{t('First name')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.familyName"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.familyName)}
                helperText={errors.user?.familyName?.message}
                fullWidth
                variant="outlined"
                placeholder="山田"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormLabelStyle>{t('Last name')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.givenName"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.givenName)}
                helperText={errors.user?.givenName?.message}
                fullWidth
                variant="outlined"
                placeholder="太郎"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormLabelStyle>{t('First name kana')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.familyNameKana"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.familyNameKana)}
                helperText={errors.user?.familyNameKana?.message}
                fullWidth
                variant="outlined"
                placeholder="ヤマダ"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormLabelStyle>{t('Last name kana')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.givenNameKana"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.givenNameKana)}
                helperText={errors.user?.givenNameKana?.message}
                fullWidth
                variant="outlined"
                placeholder="タロウ"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={6}>
            <FormLabelStyle>{t('Postal code')}</FormLabelStyle>
            <Controller
              control={control}
              name="user.postalCode"
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  error={Boolean(errors.user?.postalCode)}
                  helperText={errors.user?.postalCode?.message}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    inputComponent: PostalCodeMask as any
                  }}
                  placeholder="000-0000"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={6}>
            <FormLabelStyle>{t('Prefecture')}</FormLabelStyle>
            <Controller
              name="user.prefecture"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  disablePortal
                  {...field}
                  options={prefectures}
                  onChange={(_, value) => {
                    setValue('user.prefecture', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      error={Boolean(errors.user?.prefecture)}
                      helperText={errors.user?.prefecture?.message}
                      fullWidth
                      {...params}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormLabelStyle>{t('Address1')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.address1"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.address1)}
                helperText={errors.user?.address1?.message}
                fullWidth
                variant="outlined"
                placeholder="市区町村"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabelStyle>{t('Address2')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.address2"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={Boolean(errors.user?.address2)}
                helperText={errors.user?.address2?.message}
                fullWidth
                variant="outlined"
                placeholder="番地"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabelStyle>{t('Address3')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.address3"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                fullWidth
                variant="outlined"
                placeholder="建物等"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('Phone number')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.phoneNumber"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                fullWidth
                variant="outlined"
                error={Boolean(errors.user?.phoneNumber)}
                helperText={errors.user?.phoneNumber?.message}
                placeholder="000-0000-0000"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('Home phone number')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.homePhoneNumber"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                fullWidth
                variant="outlined"
                error={Boolean(errors.user?.homePhoneNumber)}
                helperText={errors.user?.homePhoneNumber?.message}
                placeholder="0000-00-0000"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabelStyle>{t('Email')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.email"
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                type="email"
                fullWidth
                variant="outlined"
                error={Boolean(errors.user?.email)}
                helperText={errors.user?.email?.message}
                placeholder="sample@example.com"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('Gender')}</FormLabelStyle>
          <FormControl component="fieldset">
            <Controller
              control={control}
              name="user.gender"
              render={({ field }) => (
                <RadioGroup {...field} row aria-label="gender">
                  <FormControlLabel
                    value={t('Female')}
                    control={<Radio />}
                    label={t('Female')}
                  />
                  <FormControlLabel
                    value={t('Male')}
                    control={<Radio />}
                    label={t('Male')}
                  />
                  <FormControlLabel
                    value={t('NoAnswer')}
                    control={<Radio />}
                    label={t('NoAnswer')}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('Birthday')}</FormLabelStyle>
          <FormControl
            component="fieldset"
            sx={{
              width: '100%'
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
              <Controller
                control={control}
                name="user.birthday"
                render={({ field }) => (
                  <DesktopDatePicker
                    {...field}
                    inputFormat="yyyy年MM月dd日"
                    mask="____年__月__日"
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...field}
                        {...params}
                        fullWidth
                        error={Boolean(errors.user?.birthday)}
                        helperText={errors.user?.birthday?.message}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('Occupation')}</FormLabelStyle>
          <Controller
            name="user.occupation"
            control={control}
            render={({ field }) => (
              <Autocomplete
                size="small"
                disablePortal
                {...field}
                options={occupations}
                onChange={(_, value) => {
                  setValue('user.occupation', value);
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={Boolean(errors.user?.occupation)}
                    helperText={errors.user?.occupation?.message}
                    fullWidth
                    {...params}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabelStyle>{t('First visit date')}</FormLabelStyle>
          <FormControl
            component="fieldset"
            sx={{
              width: '100%'
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
              <Controller
                control={control}
                name="user.firstVisitDate"
                render={({ field }) => (
                  <DesktopDatePicker
                    {...field}
                    inputFormat="yyyy年MM月dd日"
                    mask="____年__月__日"
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...field}
                        {...params}
                        fullWidth
                        error={Boolean(errors.user?.firstVisitDate)}
                        helperText={errors.user?.firstVisitDate?.message}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormLabelStyle>{t('Memo')}</FormLabelStyle>
          <Controller
            control={control}
            name="user.memo"
            render={({ field }) => (
              <TextField size="small" {...field} fullWidth multiline rows="4" />
            )}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default UserForm;
