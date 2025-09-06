import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  CardProps as MuiCardProps,
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageHeight?: number;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  imageHeight = 140,
  actions,
  children,
  ...props
}) => {
  return (
    <MuiCard {...props}>
      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={title}
        />
      )}
      <CardContent>
        {title && (
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};
