import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CustomerList from 'src/components/Customer/List';

const Customers = () => {
  return (
    <>
      <Helmet>
        <title>Customers</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <CustomerList />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Customers;
