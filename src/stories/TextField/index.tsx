import { VFC } from 'react';
import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';

export type TextFieldPropsType = {
  props: TextFieldProps;
};

const Index: VFC<TextFieldPropsType> = ({ props }) => {
  return <TextField {...props} />;
};

export default Index;
