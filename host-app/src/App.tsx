import React, { Suspense, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Sidemenu from './components/Sidemenu';
import { RouteProvider } from './contexts/RouteContext';
import './App.css'

// Remote App Components
const RemoteLogin = React.lazy(() => import('remoteApp/Login'));
const RemoteRegistration = React.lazy(() => import('remoteApp/Registration'));
// Admin App Components
const AdminDashboard = React.lazy(() => import('adminApp/AdminDashboard'));
const UserManagement = React.lazy(() => import('adminApp/UserManagement'));
const MenuManagement = React.lazy(() =>
  import('adminApp/MenuManagement').catch(() => {
    // Fallback component if MenuManagement fails to load
    return {
      default: () => (
        <div>
          <h2>Menu Management</h2>
          <p>Menu Management component is currently unavailable.</p>
          <p>Please check the admin application for updates.</p>
        </div>
      )
    };
  })
);

// Route Components

const Login = () => (
  <div>
    <h2>Login</h2>
    <Suspense fallback={<div>Loading Remote Components...</div>}>
      <RemoteLogin />
    </Suspense>
  </div>
);

const RemoteConnections = () => (
  <div>
    <h2>Remote Connections</h2>
    <p>Manage your remote connections here.</p>
  </div>
);

const RemoteSettings = () => (
  <div>
    <h2>Remote Settings</h2>
    <p>Configure remote access settings.</p>

  </div>
);

const AdminReports = () => (
  <div>
    <h2>Admin Reports</h2>
    <p>View administrative reports and analytics.</p>
  </div>
);

const AdminSystem = () => (
  <div>
    <h2>System Settings</h2>
    <p>Configure system-wide settings.</p>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <RouteProvider>
          <Box sx={{ display: 'flex' }}>
            <Sidemenu open={sidebarOpen} onToggle={handleSidebarToggle} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                transition: 'margin-left 0.3s ease-in-out',
                marginLeft: 0,
              }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/remote/connections" replace />} />
                <Route path="/remote/connections" element={<RemoteConnections />} />
                <Route path="/remote/remote-settings" element={<RemoteSettings />} />
                <Route path="/remote/login" element={
                  <Suspense fallback={<div>Loading Remote Components...</div>}>
                    <RemoteLogin />
                  </Suspense>} />
                <Route path="/remote/register" element={
                  <Suspense fallback={<div>Loading Remote Components...</div>}>
                    <RemoteRegistration />
                  </Suspense>} />
                <Route path="/admin/users" element={
                  <Suspense fallback={<div>Loading Admin Components...</div>}>
                    <UserManagement />
                  </Suspense>
                } />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/system" element={<AdminSystem />} />
                <Route path="/admin" element={
                  <Suspense fallback={<div>Loading Admin Components...</div>}>
                    <AdminDashboard />
                  </Suspense>
                } />
                <Route path="/admin/menu-management" element={
                  <Suspense fallback={<div>Loading Menu Management...</div>}>
                    <MenuManagement />
                  </Suspense>
                } />
              </Routes>
            </Box>
          </Box>
        </RouteProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
