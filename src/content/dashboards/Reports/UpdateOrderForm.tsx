import { VFC, ReactElement, Ref, forwardRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Tooltip,
  Typography,
  Slide,
  styled
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateOrderFormState } from './store';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
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

interface UpdateOrderFormProps {
  orderInfo: {
    orderId: number;
    name: string;
    phoneNumber: string;
  };
  handleClose: () => void;
}

const UpdateOrderForm: VFC<UpdateOrderFormProps> = memo(
  ({ orderInfo, handleClose }) => {
    const { t }: { t: any } = useTranslation();
    const navigate = useNavigate();
    const {
      fontRate,
      openConfirmCancel,

      handleConfirmCancel,
      closeConfirmCancel,
      handleCancelCompleted
    } = useUpdateOrderFormState();

    return (
      <>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Box>
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    mb: 2
                  }}
                >
                  <Typography sx={{ fontSize: 18 * fontRate }}>
                    {t('Customer name')}
                  </Typography>
                  <Typography sx={{ fontSize: 18 * fontRate }}>
                    {orderInfo.name}???
                  </Typography>
                </Box>
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex'
                  }}
                >
                  <Typography sx={{ fontSize: 18 * fontRate }}>
                    {t('Customer phone number')}
                  </Typography>
                  <Typography sx={{ fontSize: 18 * fontRate }}>
                    {orderInfo.phoneNumber}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    justifyContent: 'flex-end',
                    display: 'flex',
                    mt: 4
                  }}
                >
                  <Tooltip title={t('Change to cancel')} arrow>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleConfirmCancel}
                      sx={{
                        mr: 4
                      }}
                    >
                      {t('Cancel')}
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('Go to Accounting page')} arrow>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        navigate(
                          `/dashboards/orders/accounting/${orderInfo.orderId}`
                        )
                      }
                    >
                      {t('To the accounts')}
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogWrapper
          open={openConfirmCancel}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={closeConfirmCancel}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >
            <AvatarError>
              <CloseIcon />
            </AvatarError>
            <Typography
              align="center"
              sx={{
                py: 4,
                px: 6
              }}
              variant="h3"
            >
              {t('Are you sure you want to permanently cancel this order')}???
            </Typography>

            <Box>
              <Button
                variant="text"
                size="large"
                sx={{
                  mx: 1
                }}
                onClick={closeConfirmCancel}
              >
                {t('Back')}
              </Button>
              <ButtonError
                onClick={() =>
                  handleCancelCompleted(orderInfo.orderId, handleClose)
                }
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                {t('Cancel')}
              </ButtonError>
            </Box>
          </Box>
        </DialogWrapper>
      </>
    );
  }
);

export default UpdateOrderForm;
