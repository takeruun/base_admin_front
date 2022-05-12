import { Box, Card, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        position: absolute;
        width: 100%;
        bottom: 0;
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
);

const Footer = () => {
  return (
    <FooterWrapper
      className="footer-wrapper"
      sx={{
        width: {}
      }}
    >
      <Box
        p={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">&copy; 2021</Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
          ></Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
};

export default Footer;
