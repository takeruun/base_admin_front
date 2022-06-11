import { VFC } from 'react';
import { styled } from '@mui/material';
import { FormLabelPropsType } from './types';

const FormLabelStyle = styled('p')(
  () => `
    margin-bottom: 8px;
    font-weight: bold;
  `
);

const Index: VFC<FormLabelPropsType> = ({ label }) => {
  return <FormLabelStyle>{label}</FormLabelStyle>;
};

export default Index;
