import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import Form from 'src/components/Category/Form';
import Grid from '@mui/material/Grid';

const CreateCategories = () => {
  return (
    <>
      <Helmet>
        <title>Categories</title>
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

export default CreateCategories;
