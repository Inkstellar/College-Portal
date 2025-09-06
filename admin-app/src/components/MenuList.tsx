import React, { useState, useEffect } from 'react';

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

const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      // API server runs on port 5001, using /api/menu/flat for flat menu structure
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

      // Update local state
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

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading menu items...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        border: '2px solid #dc3545',
        borderRadius: '8px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        margin: '10px 0'
      }}>
        <h3>Error Loading Menu</h3>
        <p>{error}</p>
        <button
          onClick={fetchMenuItems}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Group menu items by parent (root items vs children)
  const rootItems = menuItems.filter(item => !item.parentId);
  const childItems = menuItems.filter(item => item.parentId);

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #28a745',
      borderRadius: '8px',
      backgroundColor: '#f8fff9',
      margin: '10px 0'
    }}>
      <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Navigation Menu Management</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={fetchMenuItems}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Refresh Menu
        </button>
        <span style={{ color: '#666', fontSize: '14px' }}>
          Total items: {menuItems.length} | Active: {menuItems.filter(item => item.isActive).length}
        </span>
      </div>

      {/* Root Menu Items */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{
          color: '#333',
          borderBottom: '2px solid #28a745',
          paddingBottom: '5px',
          marginBottom: '15px'
        }}>
          Main Menu Items
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '15px'
        }}>
          {rootItems.map(item => (
            <div key={item.id} style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: item.isActive ? '2px solid #28a745' : '2px solid #dc3545'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: item.isActive ? '#333' : '#999'
                  }}>
                    {item.label}
                  </h4>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: item.isActive ? '#666' : '#ccc',
                    fontSize: '14px'
                  }}>
                    Route: {item.route || 'N/A'}
                  </p>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: item.isActive ? '#666' : '#ccc',
                    fontSize: '12px'
                  }}>
                    Icon: {item.icon || 'N/A'} | Order: {item.order}
                  </p>
                  <p style={{
                    margin: '0',
                    color: item.isActive ? '#666' : '#ccc',
                    fontSize: '12px'
                  }}>
                    Required Roles: {item.requiredRoles && item.requiredRoles.length > 0 ? item.requiredRoles.join(', ') : 'None'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: item.isActive ? '#d4edda' : '#f8d7da',
                    color: item.isActive ? '#155724' : '#721c24'
                  }}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => toggleActiveStatus(item.id, item.isActive)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: item.isActive ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Child Menu Items */}
      {childItems.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#333',
            borderBottom: '2px solid #28a745',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>
            Submenu Items
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '15px'
          }}>
            {childItems.map(item => {
              const parentItem = menuItems.find(parent => parent.id === item.parentId);
              return (
                <div key={item.id} style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: item.isActive ? '2px solid #28a745' : '2px solid #dc3545'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 8px 0',
                        color: item.isActive ? '#333' : '#999'
                      }}>
                        {item.label}
                      </h4>
                      <p style={{
                        margin: '0 0 8px 0',
                        color: item.isActive ? '#666' : '#ccc',
                        fontSize: '14px'
                      }}>
                        Route: {item.route || 'N/A'}
                      </p>
                      <p style={{
                        margin: '0 0 8px 0',
                        color: item.isActive ? '#666' : '#ccc',
                        fontSize: '12px'
                      }}>
                        Parent: {parentItem?.label || 'Unknown'} | Order: {item.order}
                      </p>
                      <p style={{
                        margin: '0',
                        color: item.isActive ? '#666' : '#ccc',
                        fontSize: '12px'
                      }}>
                        Required Roles: {item.requiredRoles && item.requiredRoles.length > 0 ? item.requiredRoles.join(', ') : 'None'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: item.isActive ? '#d4edda' : '#f8d7da',
                        color: item.isActive ? '#155724' : '#721c24'
                      }}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>

                      <button
                        onClick={() => toggleActiveStatus(item.id, item.isActive)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: item.isActive ? '#dc3545' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {menuItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '16px'
        }}>
          No menu items found. Make sure the API server is running and accessible.
        </div>
      )}
    </div>
  );
};

export default MenuList;
