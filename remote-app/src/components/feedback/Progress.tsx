import React from 'react';
import { 
  CircularProgress, 
  LinearProgress,
  Box,
  Typography,
  CircularProgressProps,
  LinearProgressProps
} from '@mui/material';

export interface ProgressProps {
  type?: 'circular' | 'linear';
  value?: number;
  label?: string;
  size?: number;
  thickness?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export const Progress: React.FC<ProgressProps> = ({
  type = 'circular',
  value,
  label,
  size = 40,
  thickness = 3.6,
  variant = 'determinate',
  color = 'primary'
}) => {
  const commonProps = {
    value,
    variant,
    color,
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {type === 'circular' ? (
        <CircularProgress
          size={size}
          thickness={thickness}
          {...commonProps as CircularProgressProps}
        />
      ) : (
        <LinearProgress
          sx={{ width: '100%', minWidth: 200 }}
          {...commonProps as LinearProgressProps}
        />
      )}
      {label && (
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};
