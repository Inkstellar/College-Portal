import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  children?: MenuItem[];
}

export interface ApiMenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  isActive: boolean;
  requiredRoles: string[];
  children: ApiMenuItem[];
}

// Icon mapping from API string to Material-UI components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Dashboard: DashboardIcon,
  People: PeopleIcon,
  School: SchoolIcon,
  Assessment: AssessmentIcon,
  Settings: SettingsIcon,
  AccountCircle: AccountCircleIcon,
  Business: BusinessIcon,
  Description: DescriptionIcon,
  Analytics: AnalyticsIcon,
  Notifications: NotificationsIcon,
};

// API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

// Convert API menu item to frontend MenuItem
const convertApiMenuItem = (apiItem: ApiMenuItem): MenuItem => {
  const IconComponent = iconMap[apiItem.icon] || SettingsIcon;

  return {
    id: apiItem.id,
    label: apiItem.label,
    icon: React.createElement(IconComponent),
    route: apiItem.route,
    children: apiItem.children?.map(convertApiMenuItem) || [],
  };
};

// Cache for menu items
let menuCache: MenuItem[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch menu items from API
export const fetchMenuItems = async (userRole?: string): Promise<MenuItem[]> => {
  try {
    // Check cache first
    const now = Date.now();
    if (menuCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached menu items');
      return menuCache;
    }

    console.log(`Fetching menu items from API: ${API_BASE_URL}/api/menu${userRole ? `?role=${userRole}` : ''}`);

    const roleParam = userRole ? `?role=${userRole}` : '';
    const response = await fetch(`${API_BASE_URL}/api/menu${roleParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.status} ${response.statusText}`);
    }

    const apiMenuItems: ApiMenuItem[] = await response.json();
    console.log('Received menu items from API:', apiMenuItems);

    // Convert API response to frontend format
    const menuItems = apiMenuItems.map(convertApiMenuItem);

    // Update cache
    menuCache = menuItems;
    cacheTimestamp = now;

    console.log('Successfully processed menu items:', menuItems.length);
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items from API:', error);
    console.log('API unavailable, returning empty menu');

    // Return empty array if API fails
    return [];
  }
};

// Get fallback menu items (original static data)
const getFallbackMenuItems = (): MenuItem[] => [
  {
    id: 'remote-app',
    label: 'Remote Access',
    icon: React.createElement(DashboardIcon),
    route: '/remote',
    children: [
      {
        id: 'remote-dashboard',
        label: 'Remote Dashboard',
        icon: React.createElement(DashboardIcon),
        route: '/remote/dashboard'
      },
      {
        id: 'remote-connections',
        label: 'Connections',
        icon: React.createElement(PeopleIcon),
        route: '/remote/connections'
      },
      {
        id: 'remote-settings',
        label: 'Remote Settings',
        icon: React.createElement(SettingsIcon),
        route: '/remote/settings'
      },
    ],
  },
  {
    id: 'admin-app',
    label: 'Administration',
    icon: React.createElement(SchoolIcon),
    route: '/admin',
    children: [
      {
        id: 'admin-users',
        label: 'User Management',
        icon: React.createElement(PeopleIcon),
        route: '/admin/users'
      },
      {
        id: 'admin-reports',
        label: 'Admin Reports',
        icon: React.createElement(AssessmentIcon),
        route: '/admin/reports'
      },
      {
        id: 'admin-system',
        label: 'System Settings',
        icon: React.createElement(SettingsIcon),
        route: '/admin/system'
      },
    ],
  },
];

// Export the async function as the main way to get menu items
export const getMenuItems = fetchMenuItems;

// For backward compatibility, export a promise that resolves to menu items
export const menuItems = fetchMenuItems();

// Clear cache (useful for development or when user role changes)
export const clearMenuCache = () => {
  menuCache = null;
  cacheTimestamp = 0;
};
