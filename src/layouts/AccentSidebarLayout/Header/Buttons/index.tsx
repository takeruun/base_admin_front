import { Box } from '@mui/material';
import HeaderNotifications from './Notifications';
import internationalization from 'src/i18n/i18n';

const HeaderButtons = () => {
  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };

  return (
    <Box>
      <HeaderNotifications />
    </Box>
  );
};

export default HeaderButtons;
