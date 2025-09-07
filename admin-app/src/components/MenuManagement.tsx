import React, { useState, useEffect } from 'react';
import MenuItemForm from './MenuItemForm';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  MoreHoriz,
} from '@mui/icons-material';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  requiredRoles: string[];
  createdAt?: string;
  updatedAt?: string;
}

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/menu/flat?includeInactive=true');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const menuItemData = {
        ...formData,
        requiredRoles: formData.requiredRoles ? formData.requiredRoles.split(',').map((role: string) => role.trim()) : [],
        parentId: formData.parentId || null
      };

      const url = editingItem
        ? `http://localhost:5001/api/menu/${editingItem.id}`
        : 'http://localhost:5001/api/menu';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMenuItems();
      setEditingItem(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError(`Failed to ${editingItem ? 'update' : 'create'} menu item`);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowCreateForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMenuItems();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Failed to delete menu item');
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5001/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMenuItems(items =>
        items.map(item =>
          item.id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Failed to update menu item status');
    }
  };

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent | null,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    const allItemIds = menuItems.map(item => item.id);
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? allItemIds : [],
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading menu items...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6">Error Loading Menu</Typography>
        <Typography>{error}</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={fetchMenuItems}
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  const rootItems = menuItems.filter(item => !item.parentId);
  const childItems = menuItems.filter(item => item.parentId);

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>

      <Typography variant="h4" component="h2" gutterBottom color="primary">
        Remote Menu Management System
      </Typography>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#efefef', borderRadius:2, mb:2}}>
        <Toolbar sx={{ justifyContent: 'end'}}>
          <Box sx={{ display: 'flex', flex:1,minHeight:'64px', alignItems: 'center', gap: 1,flexDirection:'row-reverse', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={showCreateForm ? "" : <AddIcon />}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Add New Menu Item'}
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<RefreshIcon />}
              onClick={fetchMenuItems}
            >
              Refresh
            </Button>
            <Box sx={{flex:1}}></Box>
            <Typography variant="body2" color="text.secondary">
              Total items: {menuItems.length} | Active: {menuItems.filter(item => item.isActive).length}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Stack spacing={2} direction={'row'} >
        {/* Menu Tree View */}
        <Box sx={{ mb: 4, flex: 1, maxWidth: '50%' }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 1 }}>
            Menu Structure
          </Typography>

          {menuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No menu items found. Make sure the API server is running and accessible.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <div>
                <Button onClick={handleExpandClick}>
                  {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
              </div>
              <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <SimpleTreeView
                  expandedItems={expandedItems}
                  onExpandedItemsChange={handleExpandedItemsChange}
                >
                  {rootItems.map(rootItem => (
                    <TreeItem
                      key={rootItem.id}
                      itemId={rootItem.id}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                          {rootItem.parentId ? <FileIcon /> : <FolderIcon />}
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {rootItem.label}
                          </Typography>
                          <Chip
                            label={rootItem.isActive ? 'Active' : 'Inactive'}
                            color={rootItem.isActive ? 'success' : 'error'}
                            size="small"
                            icon={rootItem.isActive ? <ActiveIcon /> : <InactiveIcon />}
                          />
                          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(rootItem);
                                }}
                              >
                                <MoreHoriz fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title={rootItem.isActive ? 'Deactivate' : 'Activate'}>
                              <IconButton
                                size="small"
                                color={rootItem.isActive ? 'error' : 'success'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleActiveStatus(rootItem.id, rootItem.isActive);
                                }}
                              >
                                {rootItem.isActive ? <InactiveIcon fontSize="small" /> : <ActiveIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(rootItem.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip> */}
                          </Box>
                        </Box>
                      }
                    >
                      {childItems
                        .filter(child => child.parentId === rootItem.id)
                        .map(childItem => (
                          <TreeItem
                            key={childItem.id}
                            itemId={childItem.id}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                <FileIcon />
                                <Typography variant="body2">
                                  {childItem.label}
                                </Typography>
                                <Chip
                                  label={childItem.isActive ? 'Active' : 'Inactive'}
                                  color={childItem.isActive ? 'success' : 'error'}
                                  size="small"
                                  icon={childItem.isActive ? <ActiveIcon /> : <InactiveIcon />}
                                />
                                <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      color="warning"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(childItem);
                                      }}
                                    >
                                      <MoreHoriz fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  {/* <Tooltip title={childItem.isActive ? 'Deactivate' : 'Activate'}>
                                    <IconButton
                                      size="small"
                                      color={childItem.isActive ? 'error' : 'success'}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleActiveStatus(childItem.id, childItem.isActive);
                                      }}
                                    >
                                      {childItem.isActive ? <InactiveIcon fontSize="small" /> : <ActiveIcon fontSize="small" />}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(childItem.id);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip> */}
                                </Box>
                              </Box>
                            }
                          />
                        ))}
                    </TreeItem>
                  ))}
                </SimpleTreeView>
              </Box>
            </Stack>
          )}
        </Box>
      {showCreateForm && (
        <MenuItemForm
          editingItem={editingItem}
          rootItems={rootItems}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onToggleActive={toggleActiveStatus}
        />
      )}
      </Stack>
    </Paper>
  );
};

export default MenuManagement;
