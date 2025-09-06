import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';

export interface GridProps extends MuiGridProps {
  spacing?: number;
  container?: boolean;
  item?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  children,
  spacing = 2,
  container = false,
  item = false,
  ...props 
}) => {
  return (
    <MuiGrid
      container={container}
      item={item}
      spacing={spacing}
      {...props}
    >
      {children}
    </MuiGrid>
  );
};
