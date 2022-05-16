import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

export type SearchPropsType = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  sx?: SxProps<Theme>;
  placeholder: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  margin?: 'none' | 'normal' | 'dense';
  variant?: 'outlined';
};
