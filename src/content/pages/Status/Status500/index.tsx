import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslation } from 'react-i18next';

const GridWrapper = styled(Grid)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
);

function Status500() {
  const { t }: { t: any } = useTranslation();

  const [pending, setPending] = useState(false);
  function handleClick() {
    setPending(true);
  }

  return (
    <>
      <Helmet>
        <title>Status - 500</title>
      </Helmet>
      <MainContent>
        <Grid
          container
          sx={{
            height: '100%'
          }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <img
                  alt="500"
                  height={260}
                  src="/static/images/status/500.svg"
                />
                <Typography
                  variant="h2"
                  sx={{
                    my: 2
                  }}
                >
                  {t('There was an error, please try again later')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 4
                  }}
                >
                  {t(
                    'The server encountered an internal error and was not able to complete your request'
                  )}
                </Typography>
                <LoadingButton
                  onClick={handleClick}
                  loading={pending}
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshTwoToneIcon />}
                >
                  {t('Refresh view')}
                </LoadingButton>
                <Button
                  href="/"
                  variant="contained"
                  sx={{
                    ml: 1
                  }}
                >
                  {t('Go back')}
                </Button>
              </Box>
            </Container>
          </Grid>
          <GridWrapper
            sx={{
              display: { xs: 'none', md: 'flex' }
            }}
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <TypographyPrimary
                  variant="h1"
                  sx={{
                    my: 2
                  }}
                >
                  {t('example Admin')}
                </TypographyPrimary>
                <TypographySecondary
                  variant="h4"
                  fontWeight="normal"
                  sx={{
                    mb: 4
                  }}
                >
                  {t(
                    'High performance React template built with lots of powerful MUI (Material-UI) components across multiple product niches for fast & perfect apps development processes.'
                  )}
                </TypographySecondary>
                <Button href="/" size="large" variant="contained">
                  {t('Overview')}
                </Button>
              </Box>
            </Container>
          </GridWrapper>
        </Grid>
      </MainContent>
    </>
  );
}

export default Status500;
