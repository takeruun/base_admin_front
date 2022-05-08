import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Form from 'src/components/Customer/Form';

function CreateCustomers() {
  return (
    <>
      <Helmet>
        <title>Customers</title>
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

export default CreateCustomers;
