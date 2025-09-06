import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  ...props
}) => {
  return (
    <MuiTextField
      variant={variant}
      fullWidth={fullWidth}
      {...props}
    />
  );
};
