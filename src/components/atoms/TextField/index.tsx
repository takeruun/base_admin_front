import { VFC } from 'react';
import TextField from '@mui/material/TextField';
import { TextFieldPropsType } from './types';

const Index: VFC<TextFieldPropsType> = ({ props }) => {
  return <TextField fullWidth variant="outlined" {...props} />;
};

export default Index;
