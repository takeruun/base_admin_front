import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  alpha,
  IconButton,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import HeaderSearch from './Search';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(8px);
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        width: ${theme.spacing(7)};
        height: ${theme.spacing(7)};
`
);

const pageTitle = (path: string): string => {
  switch (path) {
    case '/dashboards/customers':
      return 'Customers Management';
    case '/dashboards/customers/new':
      return 'Create Customer';
    case '/dashboards/orders':
      return 'Orders Management';
    case '/dashboards/orders/new':
      return 'Create Order';
    case '/dashboards/orders/receipt':
      return 'Receipt';
    case '/dashboards/calendar':
      return 'Reservation Calendar';
    case '/dashboards/courses':
      return 'Courses Management';
    case '/dashboards/courses/new':
      return 'Create Course';
    case '/dashboards/products':
      return 'Products Management';
    case '/dashboards/products/new':
      return 'Create Product';
    case '/dashboards/categories':
      return 'Categories Management';
    case '/dashboards/categories/new':
      return 'Create Category';
    case '/dashboards/administrators':
      return 'Administrators Management';
    case '/dashboards/administrators/new':
      return 'Create Administrator';
    default:
      return 'Home';
  }
};

const Header = () => {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper display="flex" alignItems="center">
      {pathname !== '/dashboards' ? (
        <Tooltip arrow title={t('Back')}>
          <IconButtonWrapper onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButtonWrapper>
        </Tooltip>
      ) : (
        <Box></Box>
      )}
      <Typography
        variant="h3"
        component="h3"
        gutterBottom
        sx={{ position: 'fixed', width: '100vw', left: '45%' }}
      >
        {t(pageTitle(pathname))}
      </Typography>
      <Box display="flex" alignItems="center">
        <HeaderSearch />
        <HeaderButtons />
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
};

export default Header;
