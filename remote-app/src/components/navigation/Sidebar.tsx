import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

export interface SidebarItem {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  open: boolean;
  onClose: () => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  open,
  onClose,
  width = 240,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;