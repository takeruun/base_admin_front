import { ReactElement, Ref, forwardRef, VFC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Slide,
  Button,
  Typography,
  Dialog,
  styled
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { AlertDialogPropsType } from './types';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
    background: ${theme.colors.error.main};
    color: ${theme.palette.error.contrastText};

    &:hover {
      background: ${theme.colors.error.dark};
    }
  `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AlertDialog: VFC<AlertDialogPropsType> = memo(
  ({
    open,
    onClose,
    handleAlertDone,
    alertMainMessage,
    alertButtomMessage,
    mode
  }) => {
    const { t }: { t: any } = useTranslation();
    return (
      <DialogWrapper
        open={open}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          {mode == 'success' ? (
            <AvatarSuccess>
              <DoneIcon />
            </AvatarSuccess>
          ) : (
            <AvatarError>
              <CloseIcon />
            </AvatarError>
          )}

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {alertMainMessage}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={onClose}
            >
              {t('Back')}
            </Button>
            {mode == 'success' ? (
              <Button
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                onClick={handleAlertDone}
                variant="contained"
              >
                {alertButtomMessage}
              </Button>
            ) : (
              <ButtonError
                onClick={handleAlertDone}
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                {alertButtomMessage}
              </ButtonError>
            )}
          </Box>
        </Box>
      </DialogWrapper>
    );
  }
);

export default AlertDialog;
