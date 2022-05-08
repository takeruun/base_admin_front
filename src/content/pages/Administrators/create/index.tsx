import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import Grid from '@mui/material/Grid';
import Footer from 'src/components/Footer';
import Form from 'src/components/Administrator/Form';

const CreateAdministrators: FC = () => {
  return (
    <>
      <Helmet>
        <title>Administrators</title>
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
      >
        <Grid item xs={12}>
          <Form />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default CreateAdministrators;
