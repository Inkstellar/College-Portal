import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import { Container } from './layout/Container';
import { Grid } from './layout/Grid';
import { Navbar, Sidebar } from './navigation/';
import { TextField } from './forms/TextField';
import { Button } from './forms/Button';
import { Alert } from './feedback/Alert';
import { Progress } from './feedback/Progress';
import { Card } from './display/Card';
import { Badge } from './display/Badge';
import { Table } from './data/Table';
import { List } from './data/List';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
    <Paper sx={{ p: 2 }}>{children}</Paper>
  </Box>
);

export const ComponentShowcase: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);

  const sidebarItems = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <PersonIcon />, label: 'Profile' },
  ];

  const tableColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO Code', minWidth: 100 },
    { id: 'population', label: 'Population', minWidth: 170, align: 'right' as const },
  ];

  const tableData = [
    { name: 'India', code: 'IN', population: 1380004385 },
    { name: 'China', code: 'CN', population: 1439323776 },
  ];

  const listItems = [
    { id: 1, primary: 'Inbox', secondary: 'New messages', icon: <MailIcon />, onClick: () => console.log('clicked') },
    { id: 2, primary: 'Drafts', secondary: '2 drafts', icon: <MailIcon /> },
  ];

  return (
    <Container>
      <Typography variant="h3" sx={{ my: 4 }}>Component Library</Typography>

      <Section title="Layout Components">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
              Container Component
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white' }}>
              Grid Component
            </Paper>
          </Grid>
        </Grid>
      </Section>

      <Section title="Navigation Components">
        <Box sx={{ mb: 2 }}>
          <Navbar 
            title="Navigation Bar" 
            onMenuClick={() => setSidebarOpen(true)}
            actions={<Button color="inherit">Login</Button>}
          />
        </Box>
        <Sidebar
          items={sidebarItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Section>

      <Section title="Form Components">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Text Field" placeholder="Enter text..." />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained">Primary</Button>
              <Button variant="outlined">Secondary</Button>
              <Button variant="contained" loading>Loading</Button>
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section title="Feedback Components">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Button onClick={() => setAlertOpen(true)}>Show Alert</Button>
              <Alert
                severity="success"
                floating
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                message="This is a success message!"
              />
            </Box>
            <Alert severity="error" message="This is an error message" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Progress type="circular" value={75} label="75%" />
              <Progress type="linear" value={75} />
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section title="Display Components">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card
              title="Sample Card"
              subtitle="This is a sample card component"
              image="https://source.unsplash.com/random/800x600"
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small">Learn More</Button>
                  <Button size="small">Share</Button>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Badge label="Default" />
              <Badge label="Primary" color="primary" />
              <Badge label="Success" color="success" />
              <Badge label="Error" color="error" />
              <Badge label="Warning" color="warning" />
              <Badge label="Info" color="info" />
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section title="Data Components">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Table
              columns={tableColumns}
              rows={tableData}
              sortable
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <List
              items={listItems}
              dividers
              selectable
            />
          </Grid>
        </Grid>
      </Section>
    </Container>
  );
};
