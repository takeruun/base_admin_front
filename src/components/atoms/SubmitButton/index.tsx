import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { SubmitButtonPropsType } from './types';

const Index: VFC<SubmitButtonPropsType> = ({ props, text, isSubmitting }) => {
  const { t }: { t: any } = useTranslation();
  return (
    <Button
      type="submit"
      {...props}
      startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
      disabled={isSubmitting}
    >
      {t(text)}
    </Button>
  );
};

export default Index;
