import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Block as DeactivateIcon,
  CheckCircle as ActivateIcon
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

interface MenuItemFormProps {
  editingItem?: MenuItem | null;
  rootItems: MenuItem[];
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onToggleActive?: (id: string, currentStatus: boolean) => Promise<void>;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  editingItem,
  rootItems,
  onSubmit,
  onCancel,
  onDelete,
  onToggleActive
}) => {
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    icon: '',
    route: '',
    parentId: '',
    order: 0,
    isActive: true,
    requiredRoles: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        id: editingItem.id,
        label: editingItem.label,
        icon: editingItem.icon || '',
        route: editingItem.route || '',
        parentId: editingItem.parentId || '',
        order: editingItem.order,
        isActive: editingItem.isActive,
        requiredRoles: editingItem.requiredRoles ? editingItem.requiredRoles.join(', ') : ''
      });
    } else {
      // Reset form for new item
      setFormData({
        id: '',
        label: '',
        icon: '',
        route: '',
        parentId: '',
        order: 0,
        isActive: true,
        requiredRoles: ''
      });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, flex:1 }}>
      <Typography variant="h5" component="h3" gutterBottom color="primary">
        {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column',  flexWrap: 'none', gap: 2, mb: 3 }}>
          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required={!editingItem}
              disabled={!!editingItem}
              placeholder="unique-identifier"
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="Label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              required
              placeholder="Menu Item Label"
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="Icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="Dashboard, People, Settings..."
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="Route"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              placeholder="/admin/users, /dashboard..."
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto',textAlign:'left' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Parent Menu</InputLabel>
              <Select
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                label="Parent Menu"
              >
                <MuiMenuItem value="">
                  <em>None (Root Item)</em>
                </MuiMenuItem>
                {rootItems.map(item => (
                  <MuiMenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              required
              inputProps={{ min: 0 }}
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <TextField
              fullWidth
              label="Required Roles"
              name="requiredRoles"
              value={formData.requiredRoles}
              onChange={handleInputChange}
              placeholder="admin, faculty (comma-separated)"
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: 250, flex: '1 1 auto' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Active"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                bgcolor: 'grey.50',
                width: '100%', m:0
              }}
            />
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          {/* Action buttons for editing existing items */}
          {editingItem && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'warning.main' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Danger Zone:</strong> This action cannot be undone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {/* <Tooltip title={editingItem.isActive ? 'Deactivate this menu item' : 'Activate this menu item'}>
                  <Button
                    variant="outlined"
                    color={editingItem.isActive ? 'warning' : 'success'}
                    startIcon={editingItem.isActive ? <DeactivateIcon /> : <ActivateIcon />}
                    onClick={() => onToggleActive && onToggleActive(editingItem.id, editingItem.isActive)}
                    size="small"
                  >
                    {editingItem.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </Tooltip> */}
                <Tooltip title="Permanently delete this menu item">
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${editingItem.label}"? This action cannot be undone.`)) {
                        onDelete && onDelete(editingItem.id);
                      }
                    }}
                    size="small"
                  >
                    Delete Item
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Main form buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ flex: 1 }}
            >
              {editingItem ? 'Update Menu Item' : 'Create Menu Item'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MenuItemForm;
