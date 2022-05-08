import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { useOrder } from 'src/hooks/useOrder';
import Form from 'src/components/Order/Form';

function CreateOrder() {
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
}

export default CreateOrder;
