import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import TodayReservationList from './TodayReservationList';
import SaleData from './SaleData';
import CalendarTodayReservation from './CalendarTodayReservation';

function DashboardReports() {
  return (
    <>
      <Helmet>
        <title>Reports Dashboard</title>
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
          <Grid item xs={12} sm={6}>
            <TodayReservationList />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CalendarTodayReservation />
        </Grid>
        <Grid item xs={12}>
          <SaleData />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default DashboardReports;
