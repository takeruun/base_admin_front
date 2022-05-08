import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Form from 'src/components/Customer/Form';

import { useGetUser } from 'src/hooks/useUser';

function EditCustomers() {
  const { userId } = useParams();
  const { getUser, user, loading } = useGetUser();

  useEffect(() => {
    getUser(parseInt(userId));
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
          <Form user={user} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default EditCustomers;
