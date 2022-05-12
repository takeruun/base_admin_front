import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import Calendar from 'src/components/Calendar';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';

const ApplicationsCalendar = () => {
  const navigate = useNavigate();

  const handleAddClick = (): void => {
    navigate('/dashboards/orders/new');
  };

  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader handleCreateEvent={handleAddClick} />
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
          <Calendar />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default ApplicationsCalendar;
