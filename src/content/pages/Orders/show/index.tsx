import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import OrderInfo from './OrderInfo';

function Order() {
  return (
    <>
      <Helmet>
        <title>Order</title>
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
        <Grid item xs={12}>
          <OrderInfo />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Order;
