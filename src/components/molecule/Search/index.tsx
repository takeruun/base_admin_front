import { VFC, memo } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { SearchPropsType } from './types';

const Search: VFC<SearchPropsType> = memo(
  ({
    onChange,
    value,
    sx,
    placeholder,
    size = 'medium',
    fullWidth,
    margin = 'normal',
    variant
  }) => {
    return (
      <TextField
        sx={sx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          )
        }}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        size={size}
        fullWidth={fullWidth}
        margin={margin}
        variant={variant}
      />
    );
  }
);

export default Search;
