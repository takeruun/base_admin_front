import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Form from 'src/components/Customer/Form';
import { useCustomer } from 'src/hooks/useCustomer';

const EditCustomers = () => {
  const { customerId } = useParams();
  const { customer, getCustomer } = useCustomer();

  useEffect(() => {
    getCustomer(parseInt(customerId));
  }, []);

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
          <Form customer={customer} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default EditCustomers;
