import React from 'react';

interface AdminDashboardProps {
  title?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ title = "Admin Dashboard" }) => {
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      margin: '10px 0'
    }}>
      <h2 style={{ color: '#007bff', marginBottom: '15px' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>1,234</p>
        </div>
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Active Sessions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>89</p>
        </div>
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>System Status</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>Online</p>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          Refresh Data
        </button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Export Report
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
