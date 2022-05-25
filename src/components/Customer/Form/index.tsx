import React, { VFC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import {
  Autocomplete,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  styled
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ja from 'date-fns/locale/ja';

import type { Customer } from 'src/models/customer';
import UserDialogAction from 'src/components/Customer/Form/UserDialogAction';
import { useCustomerForm } from './store';

interface FormPropsType {
  customer?: Customer;
}

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

const PostalCodeMask = React.forwardRef<HTMLInputElement, CustomProps>(
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

const Form: VFC<FormPropsType> = ({ customer }) => {
  const { t }: { t: any } = useTranslation();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,

    setCustomer,
    updateAddress,
    prefectures,
    occupations,
    getPrefectures,
    getOccupations
  } = useCustomerForm(customer?.id);

  useEffect(() => setCustomer(customer), [customer]);

  useEffect(() => {
    const subscription = updateAddress();
    return () => subscription.unsubscribe();
  }, [updateAddress]);

  useEffect(() => {
    getPrefectures();
    getOccupations();
  }, []);

  return (
    <>
      <Card>
        <CardHeader title={t('Customer info')} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <FormLabelStyle>{t('First name')}</FormLabelStyle>
                <Controller
                  control={control}
                  name="familyName"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.familyName)}
                      helperText={errors.familyName?.message}
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
                  name="givenName"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.givenName)}
                      helperText={errors.givenName?.message}
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
                  name="familyNameKana"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.familyNameKana)}
                      helperText={errors.familyNameKana?.message}
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
                  name="givenNameKana"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.givenNameKana)}
                      helperText={errors.givenNameKana?.message}
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
                    name="postalCode"
                    render={({ field }) => (
                      <TextField
                        size="small"
                        {...field}
                        error={Boolean(errors.postalCode)}
                        helperText={errors.postalCode?.message}
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
                    name="prefecture"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        size="small"
                        disablePortal
                        {...field}
                        options={prefectures}
                        onChange={(_, value) => {
                          setValue('prefecture', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            error={Boolean(errors.prefecture)}
                            helperText={errors.prefecture?.message}
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
                  name="address1"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.address1)}
                      helperText={errors.address1?.message}
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
                  name="address2"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      error={Boolean(errors.address2)}
                      helperText={errors.address2?.message}
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
                  name="address3"
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.phoneNumber)}
                      helperText={errors.phoneNumber?.message}
                      placeholder="000-0000-0000"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabelStyle>{t('Home phone number')}</FormLabelStyle>
                <Controller
                  control={control}
                  name="homePhoneNumber"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.homePhoneNumber)}
                      helperText={errors.homePhoneNumber?.message}
                      placeholder="0000-00-0000"
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
                      size="small"
                      {...field}
                      type="email"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
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
                    name="gender"
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
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={ja}
                  >
                    <Controller
                      control={control}
                      name="birthday"
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
                              error={Boolean(errors.birthday)}
                              helperText={errors.birthday?.message}
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
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      size="small"
                      disablePortal
                      {...field}
                      options={occupations}
                      onChange={(_, value) => {
                        setValue('occupation', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          error={Boolean(errors.occupation)}
                          helperText={errors.occupation?.message}
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
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={ja}
                  >
                    <Controller
                      control={control}
                      name="firstVisitDate"
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
                              error={Boolean(errors.firstVisitDate)}
                              helperText={errors.firstVisitDate?.message}
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
                  name="memo"
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      fullWidth
                      multiline
                      rows="4"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <UserDialogAction
              isSubmitting={isSubmitting}
              editing={Boolean(customer)}
            />
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form;
