import { VFC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import {
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import SelectCustomer from './SelectCustomer';
import { useEasyOrderCreationState } from './store';

export type FormIputType = {
  customerId: number;
  dateOfVisit: string;
  dateOfVisitTime: string;
  dateOfExit: string;
  memo: string;
};

const EasyOrderCreation: VFC = memo(() => {
  const { t }: { t: any } = useTranslation();
  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    userName,
    dialogOpen,

    onSubmit,
    handleOpenDialog,
    handleCloseDialog,
    handleSelectCustomer,
    handleSetUserName,
    handleCloseEasyOrderCreation
  } = useEasyOrderCreationState();

  return (
    <>
      <DialogTitle>
        <Typography variant="h4" gutterBottom>
          {t('Easy order creation')}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
            >
              <Box pr={2} sx={{ pb: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Customer')}:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ mb: 2 }}>
              <Typography
                sx={{ '&:hover': { cursor: 'pointer' } }}
                onClick={handleOpenDialog}
              >
                {getValues('customerId') == 0
                  ? `${t('Customer select')}`
                  : `${userName}`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
            >
              <Box pr={2} sx={{ pb: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Date of visit')}:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ mb: 2 }}>
              <Controller
                control={control}
                name="dateOfVisit"
                render={({ field }) => (
                  <DesktopDatePicker
                    {...field}
                    inputFormat="yyyy年MM月dd日"
                    mask="____年__月__日"
                    renderInput={(params) => (
                      <TextField
                        {...field}
                        {...params}
                        error={Boolean(errors.dateOfVisit)}
                        helperText={errors.dateOfVisit?.message}
                        size="small"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
            >
              <Box pr={2} sx={{ pb: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Date of visit time')}:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ mb: 2 }}>
              <Controller
                control={control}
                name="dateOfVisitTime"
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="time"
                    size="small"
                    error={Boolean(errors.dateOfVisitTime)}
                    helperText={errors.dateOfVisitTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
            >
              <Box pr={2} sx={{ pb: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Date of exit')}:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ mb: 2 }}>
              <Controller
                control={control}
                name="dateOfExit"
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="time"
                    size="small"
                    error={Boolean(errors.dateOfExit)}
                    helperText={errors.dateOfExit?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent="flex-end"
              textAlign={{ sm: 'right' }}
            >
              <Box pr={2} sx={{ pb: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Memo')}:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Controller
                control={control}
                name="memo"
                render={({ field }) => (
                  <TextField
                    size="small"
                    {...field}
                    fullWidth
                    multiline
                    rows="4"
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions
            sx={{
              p: 1,
              pb: 0
            }}
          >
            <Button color="secondary" onClick={handleCloseEasyOrderCreation}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={isSubmitting}
              variant="contained"
            >
              {t('Add new order')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Dialog open={dialogOpen} fullWidth onClose={handleCloseDialog}>
        <SelectCustomer
          handleSelectCustomer={handleSelectCustomer}
          handleCloseDialog={handleCloseDialog}
          handleSetUserName={handleSetUserName}
        />
      </Dialog>
    </>
  );
});

export default EasyOrderCreation;
