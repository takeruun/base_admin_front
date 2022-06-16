import { VFC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputAdornment, TextField } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { SearchPropsType } from './types';

const Search: VFC<SearchPropsType> = memo(
  ({
    search,
    onChange,
    value,
    sx,
    placeholder,
    size = 'medium',
    fullWidth,
    margin = 'normal',
    variant
  }) => {
    const { t }: { t: any } = useTranslation();
    return (
      <TextField
        sx={sx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                size="small"
                sx={{ py: 0.5 }}
                onClick={search}
              >
                {t('Search')}
              </Button>
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
