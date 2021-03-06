import { useTranslation } from 'react-i18next';

import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';

const PageHeader = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Products Management')}
          </Typography>
        </Grid>
        <Grid item>
          <Link
            to="/dashboards/products/new"
            style={{ textDecoration: 'none' }}
          >
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create Product')}
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;
