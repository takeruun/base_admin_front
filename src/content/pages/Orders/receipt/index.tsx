import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Box, Container } from '@mui/material';
import ReceiptContent from 'src/components/Order/ReceiptContent';

const Receipt = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('Receipt')}</title>
      </Helmet>
      <Container>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <ReceiptContent />
        </Box>
      </Container>
    </>
  );
};

export default Receipt;
