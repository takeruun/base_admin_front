import { FC, useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
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
import { useOrderCalendar } from 'src/hooks/useOrderCalendar';
import SelectUserDialog from './SelectUserDialog';

interface EasyOrderCreationPropsType {
  onClose: () => void;
  selectDate: string;
  selectTime?: string;
}

export type FormIputType = {
  userId: number;
  dateOfVisit: string;
  dateOfVisitTime: string;
  dateOfExit: string;
  memo: string;
};

const EasyOrderCreation: FC<EasyOrderCreationPropsType> = memo(
  ({ onClose, selectDate, selectTime }) => {
    const { t }: { t: any } = useTranslation();
    const { postEasyOrderCreation } = useOrderCalendar();
    const {
      setValue,
      getValues,
      control,
      handleSubmit,
      formState: { errors, isSubmitting }
    } = useForm<FormIputType>({
      defaultValues: {
        userId: 0,
        dateOfVisit: selectDate,
        dateOfVisitTime: selectTime ?? '',
        dateOfExit: '',
        memo: ''
      }
    });

    const [userName, setUserName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = useCallback(() => setDialogOpen(true), []);
    const handleCloseDialog = useCallback(() => setDialogOpen(false), []);
    const handleSelectUser = useCallback(
      (userId: number) => setValue('userId', userId),
      []
    );
    const handleSetUserName = useCallback(
      (userName: string) => setUserName(userName),
      []
    );

    const onSubmit = (data: FormIputType) => {
      postEasyOrderCreation(data, () => {
        onClose();
      });
    };

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
                  {getValues('userId') == 0
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
                p: 1
              }}
            >
              <Button color="secondary" onClick={onClose}>
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="contained"
              >
                {t('Add new order')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
        <Dialog open={dialogOpen} fullWidth onClose={handleCloseDialog}>
          <SelectUserDialog
            handleSelectUser={handleSelectUser}
            handleCloseDialog={handleCloseDialog}
            handleSetUserName={handleSetUserName}
          />
        </Dialog>
      </>
    );
  }
);

export default EasyOrderCreation;
