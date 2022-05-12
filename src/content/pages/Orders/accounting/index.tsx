import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import OrderDetail from './OrderDetail';

const Accounting = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('Accounting')}</title>
      </Helmet>
      <Grid
        sx={{
          pt: 4,
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12} md={9}>
          <OrderDetail />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Accounting;
