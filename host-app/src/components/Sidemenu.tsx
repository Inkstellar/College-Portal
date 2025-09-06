import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { fetchMenuItems, MenuItem, clearMenuCache } from '../config/menuItems';
import { useRoute } from '../contexts/RouteContext';

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 60;

interface SidemenuProps {
  open: boolean;
  onToggle: () => void;
}

const Sidemenu: React.FC<SidemenuProps> = ({ open, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { navigateTo } = useRoute();

  // Fetch menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Sidemenu: Starting to load menu items');

        // TODO: Get user role from authentication context
        const items = await fetchMenuItems('admin'); // Default to admin for now
        console.log('Sidemenu: Loaded menu items:', items.length);

        setMenuItems(items);
        setError(null);
      } catch (err) {
        console.error('Sidemenu: Failed to load menu items:', err);
        setError('Failed to load menu');
        setMenuItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Refresh menu items
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      console.log('Sidemenu: Refreshing menu items');

      // Clear cache to force fresh fetch
      clearMenuCache();

      const items = await fetchMenuItems('admin');
      console.log('Sidemenu: Refreshed menu items:', items.length);

      setMenuItems(items);
      setError(null);
    } catch (err) {
      console.error('Sidemenu: Failed to refresh menu items:', err);
      setError('Failed to refresh menu');
      setMenuItems([]); // Set empty array on refresh error
    } finally {
      setRefreshing(false);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for items with children
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      // Navigate for items without children
      navigateTo(item.route);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ opacity: open ? 1 : 0 }}
            />
            {hasChildren && open && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: '16px',
          minHeight: '64px',
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" noWrap component="div">
              College Portal
            </Typography>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing || loading}
              size="small"
              sx={{ ml: 1 }}
            >
              <RefreshIcon
                sx={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </Box>
        )}
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <ListItem>
            <ListItemText
              primary="Error loading menu"
              secondary={error}
              sx={{ textAlign: 'center', color: 'error.main' }}
            />
          </ListItem>
        ) : (
          menuItems.map((item) => renderMenuItem(item))
        )}
      </List>
    </Drawer>
  );
};

export default Sidemenu;
