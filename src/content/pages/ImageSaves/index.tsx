import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';

import Footer from 'src/components/Footer';
import ImageSavesBody from 'src/components/ImageSaves';

const ImageSaves: FC = () => {
  return (
    <>
      <Helmet>
        <title>Image saves</title>
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
          <ImageSavesBody />
        </Grid>
      </Grid>

      <Footer />
    </>
  );
};

export default ImageSaves;
