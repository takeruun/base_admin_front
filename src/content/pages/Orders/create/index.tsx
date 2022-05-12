import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Form from 'src/components/Order/Form';

export const CreateOrder = () => {
  return (
    <>
      <Helmet>
        <title>Orders</title>
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
          <Form />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default CreateOrder;
