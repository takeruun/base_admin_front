import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CourseList from 'src/components/Course/List';
import PageHeader from './PageHeader';

function Courses() {
  return (
    <>
      <Helmet>
        <title>Courses</title>
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
          <CourseList />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Courses;
