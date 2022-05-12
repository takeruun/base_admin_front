import { VFC, ReactNode, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller } from 'react-hook-form';
import styled from '@mui/material/styles/styled';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import type { FormInputType } from 'src/components/Customer/Form';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

interface UserTextFieldFormPropsType {
  label: string;
  control: Control<FormInputType, object>;
  name: keyof FormInputType;
  error: boolean;
  helperText: ReactNode;
  textFieldProps: TextFieldProps;
}

const UserTextFieldForm: VFC<UserTextFieldFormPropsType> = memo(
  ({ label, control, name, error, helperText, textFieldProps }) => {
    const { t }: { t: any } = useTranslation();

    return (
      <>
        <FormLabelStyle>{t(label)}</FormLabelStyle>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <TextField
              {...field}
              error={error}
              helperText={helperText}
              {...textFieldProps}
            />
          )}
        />
      </>
    );
  }
);

export default UserTextFieldForm;
