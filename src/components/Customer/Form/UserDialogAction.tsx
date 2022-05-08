import { FC, memo } from 'react';
import { Button, CircularProgress, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type UserDialogActionPropsType = {
  isSubmitting: boolean;
  editing: boolean;
};

const UserDialogAction: FC<UserDialogActionPropsType> = memo(
  ({ isSubmitting, editing }) => {
    const { t }: { t: any } = useTranslation();
    const navigate = useNavigate();

    return (
      <DialogActions
        sx={{
          p: 3
        }}
      >
        <Button color="secondary" onClick={() => navigate(-1)}>
          {t('Cancel')}
        </Button>
        <Button
          type="submit"
          startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
          disabled={isSubmitting}
          variant="contained"
        >
          {editing ? t('Edit customer') : t('Add new customer')}
        </Button>
      </DialogActions>
    );
  }
);

export default UserDialogAction;
