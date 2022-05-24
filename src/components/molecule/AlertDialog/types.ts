export type AlertDialogPropsType = {
  open: boolean;
  onClose: () => void;
  handleAlertDone: () => void;
  alertMainMessage: string;
  alertButtomMessage: string;
  mode: 'error' | 'success';
};
