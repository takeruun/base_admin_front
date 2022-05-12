import { VFC, memo } from 'react';
import { Button, CircularProgress, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type OrderDialogActionPropsType = {
  isSubmitting: boolean;
  editing: boolean;
};

const OrderDialogAction: VFC<OrderDialogActionPropsType> = memo(
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
          {editing ? t('Update order') : t('Add new order')}
        </Button>
      </DialogActions>
    );
  }
);

export default OrderDialogAction;
