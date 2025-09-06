import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export interface NavbarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  onMenuClick,
  actions,
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {actions}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;