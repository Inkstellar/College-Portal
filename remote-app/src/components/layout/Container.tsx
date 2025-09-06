import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface ContainerProps extends BoxProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'lg',
  fluid = false,
  ...props 
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: fluid ? '100%' : theme => theme.breakpoints.values[maxWidth],
        mx: 'auto',
        px: { xs: 2, sm: 3 },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
