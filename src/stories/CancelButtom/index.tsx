import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';

export type CancelButtonPropsType = {
  props: ButtonProps;
  text: string;
};

const Index: VFC<CancelButtonPropsType> = ({ props, text = 'Cancel' }) => {
  const { t }: { t: any } = useTranslation();

  return (
    <Button {...props} onClick={() => {}}>
      {t(text)}
    </Button>
  );
};

export default Index;
