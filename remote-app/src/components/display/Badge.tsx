import React from 'react';
import { Chip, ChipProps, SxProps, Theme } from '@mui/material';

export interface BadgeProps extends Omit<ChipProps, 'variant'> {
  variant?: 'filled' | 'outlined';
  rounded?: boolean;
  customStyles?: SxProps<Theme>;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'filled',
  rounded = false,
  customStyles,
  sx,
  ...props
}) => {
  return (
    <Chip
      variant={variant}
      sx={{
        borderRadius: rounded ? '16px' : '4px',
        ...(customStyles as any),
        ...(sx as any),
      }}
      {...props}
    />
  );
};
