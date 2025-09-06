import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, Snackbar } from '@mui/material';

export interface AlertProps extends Omit<MuiAlertProps, 'onClose'> {
  open?: boolean;
  autoHideDuration?: number;
  message?: string;
  onClose?: () => void;
  floating?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  open = false,
  autoHideDuration = 6000,
  message,
  onClose,
  floating = false,
  children,
  ...props
}) => {
  const alertContent = (
    <MuiAlert
      onClose={onClose}
      {...props}
    >
      {message || children}
    </MuiAlert>
  );

  if (floating) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
      >
        {alertContent}
      </Snackbar>
    );
  }

  return alertContent;
};
