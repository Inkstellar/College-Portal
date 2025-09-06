const express = require('express');
const router = express.Router();
const { menuItemService } = require('../dataService');

// GET /api/menu - Get menu structure (tree format)
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;

    const allItems = await menuItemService.find({ isActive: true });

    // Filter by user role if provided
    let filteredItems = allItems;
    if (role) {
      filteredItems = allItems.filter(item => {
        // Ensure requiredRoles is an array
        const roles = item.requiredRoles || [];
        return roles.length === 0 || roles.includes(role);
      });
    }

    // Build tree structure
    const itemMap = new Map();
    const rootItems = [];

    // First pass: create map of all items
    filteredItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree
    filteredItems.forEach(item => {
      const itemWithChildren = itemMap.get(item.id);

      if (item.parentId && itemMap.has(item.parentId)) {
        // This is a child item
        const parent = itemMap.get(item.parentId);
        parent.children.push(itemWithChildren);
        parent.children.sort((a, b) => a.order - b.order);
      } else {
        // This is a root item
        rootItems.push(itemWithChildren);
      }
    });

    res.json(rootItems.sort((a, b) => a.order - b.order));
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/menu/flat - Get all menu items in flat structure
router.get('/flat', async (req, res) => {
  try {
    const { role, includeInactive = false } = req.query;

    let query = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    const allItems = await menuItemService.find(query);

    // Filter by user role if provided
    let filteredItems = allItems;
    if (role) {
      filteredItems = allItems.filter(item => {
        // Ensure requiredRoles is an array
        const roles = item.requiredRoles || [];
        return roles.length === 0 || roles.includes(role);
      });
    }

    // Sort by order and createdAt
    filteredItems.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    res.json(filteredItems);
  } catch (error) {
    console.error('Error fetching flat menu:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/menu/:id - Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await menuItemService.findOne({ id: req.params.id });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menu - Create new menu item
router.post('/', async (req, res) => {
  try {
    const { id, label, icon, route, parentId, order, isActive, requiredRoles } = req.body;

    // Check if menu item with this ID already exists
    const existingItem = await menuItemService.findOne({ id });
    if (existingItem) {
      return res.status(400).json({ error: 'Menu item with this ID already exists' });
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const parentItem = await menuItemService.findOne({ id: parentId });
      if (!parentItem) {
        return res.status(400).json({ error: 'Parent menu item not found' });
      }
    }

    const menuItemData = {
      id,
      label,
      icon,
      route,
      parentId,
      order,
      isActive,
      requiredRoles
    };

    const savedItem = await menuItemService.create(menuItemData);
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/menu/:id - Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { label, icon, route, parentId, order, isActive, requiredRoles } = req.body;

    // If parentId is provided, check if parent exists (and it's not self-referencing)
    if (parentId && parentId !== req.params.id) {
      const parentItem = await menuItemService.findOne({ id: parentId });
      if (!parentItem) {
        return res.status(400).json({ error: 'Parent menu item not found' });
      }
    }

    const updateData = {
      label,
      icon,
      route,
      parentId,
      order,
      isActive,
      requiredRoles
    };

    const menuItem = await menuItemService.findOneAndUpdate({ id: req.params.id }, updateData);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/menu/:id - Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    // Check if this item has children
    const children = await menuItemService.find({ parentId: req.params.id });
    if (children.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete menu item with children. Please delete or reassign children first.'
      });
    }

    const menuItem = await menuItemService.findOneAndDelete({ id: req.params.id });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menu/seed - Seed initial menu data
router.post('/seed', async (req, res) => {
  try {
    // Clear existing menu items
    await menuItemService.deleteMany({});

    // Seed initial menu structure
    const menuData = [
      {
        id: 'remote-app',
        label: 'Remote Access',
        icon: 'Dashboard',
        route: '/remote',
        order: 1,
        requiredRoles: []
      },
      {
        id: 'remote-dashboard',
        label: 'Remote Dashboard',
        icon: 'Dashboard',
        route: '/remote/dashboard',
        parentId: 'remote-app',
        order: 1,
        requiredRoles: []
      },
      {
        id: 'remote-connections',
        label: 'Connections',
        icon: 'People',
        route: '/remote/connections',
        parentId: 'remote-app',
        order: 2,
        requiredRoles: []
      },
      {
        id: 'remote-settings',
        label: 'Remote Settings',
        icon: 'Settings',
        route: '/remote/settings',
        parentId: 'remote-app',
        order: 3,
        requiredRoles: ['admin']
      },
      {
        id: 'admin-app',
        label: 'Administration',
        icon: 'School',
        route: '/admin',
        order: 2,
        requiredRoles: ['admin', 'faculty']
      },
      {
        id: 'admin-users',
        label: 'User Management',
        icon: 'People',
        route: '/admin/users',
        parentId: 'admin-app',
        order: 1,
        requiredRoles: ['admin']
      },
      {
        id: 'admin-reports',
        label: 'Admin Reports',
        icon: 'Assessment',
        route: '/admin/reports',
        parentId: 'admin-app',
        order: 2,
        requiredRoles: ['admin', 'faculty']
      },
      {
        id: 'admin-system',
        label: 'System Settings',
        icon: 'Settings',
        route: '/admin/system',
        parentId: 'admin-app',
        order: 3,
        requiredRoles: ['admin']
      },
      {
        id: 'admin-menu-management',
        label: 'Menu Management',
        icon: 'Settings',
        route: '/admin/menu-management',
        parentId: 'admin-app',
        order: 4,
        requiredRoles: ['admin']
      }
    ];

    const insertedItems = await menuItemService.insertMany(menuData);

    res.status(201).json({
      message: 'Menu data seeded successfully',
      count: insertedItems.length,
      items: insertedItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/menu/stats/overview - Get menu statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalItems = await menuItemService.countDocuments();
    const activeItems = await menuItemService.countDocuments({ isActive: true });
    const rootItems = await menuItemService.countDocuments({ parentId: null });
    const childItems = await menuItemService.countDocuments({ parentId: { $ne: null } });

    // Get items by role requirements
    const publicItems = await menuItemService.countDocuments({ requiredRoles: { $size: 0 } });
    const adminOnlyItems = await menuItemService.countDocuments({ requiredRoles: ['admin'] });
    const facultyItems = await menuItemService.countDocuments({ requiredRoles: 'faculty' });

    res.json({
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      rootItems,
      childItems,
      publicItems,
      adminOnlyItems,
      facultyItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
