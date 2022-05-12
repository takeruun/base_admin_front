import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import AdministratorList from 'src/components/Administrator/List';

const Administrators = () => {
  return (
    <>
      <Helmet>
        <title>Administrators</title>
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
          <AdministratorList />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Administrators;
