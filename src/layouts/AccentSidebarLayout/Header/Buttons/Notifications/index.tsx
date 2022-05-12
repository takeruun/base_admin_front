import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Popover,
  useTheme,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import { useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import Link from '@mui/material/Link';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import { useTranslation } from 'react-i18next';
import { formatDistance, subHours, subSeconds, subDays } from 'date-fns';

const AnimatedBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        box-shadow: 0 0 0 2px ${theme.palette.background.paper};
        background-color: #44b700;
        color: #44b700;
        
        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: ripple 1.2s infinite ease-in-out;
            border: 1px solid currentColor;
            content: "";
        }
    }
`
);

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        width: ${theme.spacing(7)};
        height: ${theme.spacing(7)};
`
);

const HeaderNotifications = () => {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const theme = useTheme();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Tooltip arrow title={t('Notifications')}>
        <IconButtonWrapper color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            p: 2
          }}
          display="flex"
          justifyContent="space-between"
        >
          <Typography variant="h5">{t('Notifications')}</Typography>
          <Link
            href="#"
            variant="caption"
            sx={{
              textTransform: 'none',
              pl: 3
            }}
          >
            {t('Mark all as read')}
          </Link>
        </Box>
        <Divider />

        <Box m={1}>
          <Button color="secondary" fullWidth>
            {t('View all notifications')}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default HeaderNotifications;
