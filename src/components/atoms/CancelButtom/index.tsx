import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CancelButtonPropsType } from './types';

const Index: VFC<CancelButtonPropsType> = ({ props, text = 'Cancel' }) => {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button {...props} onClick={() => navigate(-1)}>
      {t(text)}
    </Button>
  );
};

export default Index;
