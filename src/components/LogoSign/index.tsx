import {
  Avatar,
  Box,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
  useTheme
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  return (
    <TooltipWrapper title={t('example Admin')} arrow>
      <LogoWrapper to="/">
        <Avatar
          sx={{
            bgcolor: green[500]
          }}
          alt={'example'}
        >
          example
        </Avatar>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
