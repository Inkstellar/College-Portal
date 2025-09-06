# College Portal API Server

A REST API server built with Node.js, Express, and MongoDB for the College Portal micro-frontend application.

## Features

- User management (CRUD operations)
- Dashboard statistics and analytics
- CORS configured for micro-frontend integration
- MongoDB database integration
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to the api-server directory:
   ```bash
   cd api-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-portal
   NODE_ENV=development
   ```

4. Start MongoDB service (if running locally)

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### User Management
- `GET /api/users` - Get all users (with pagination, filtering, search)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/department-breakdown` - Get department statistics
- `GET /api/dashboard/system-health` - Get system health metrics

### Menu Management
- `GET /api/menu` - Get menu structure (tree format)
- `GET /api/menu/flat` - Get all menu items in flat structure
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `POST /api/menu/seed` - Seed initial menu data
- `GET /api/menu/stats/overview` - Get menu statistics

## Request/Response Examples

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science",
  "year": 2,
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Get Users with Filters
```bash
GET /api/users?page=1&limit=10&role=student&department=Computer Science&search=john
```

### Dashboard Statistics Response
```json
{
  "overview": {
    "totalUsers": 150,
    "activeUsers": 140,
    "inactiveUsers": 10,
    "newUsersThisMonth": 25
  },
  "roleDistribution": {
    "students": 120,
    "faculty": 20,
    "admins": 10
  },
  "departmentStats": [
    { "_id": "Computer Science", "count": 45 },
    { "_id": "Electrical Engineering", "count": 35 }
  ],
  "recentUsers": [...],
  "monthlyStats": [...]
}
```

### Get Menu Structure
```bash
GET /api/menu?role=admin
```

### Menu Structure Response
```json
[
  {
    "id": "remote-app",
    "label": "Remote Access",
    "icon": "Dashboard",
    "route": "/remote",
    "order": 1,
    "isActive": true,
    "requiredRoles": [],
    "children": [
      {
        "id": "remote-dashboard",
        "label": "Remote Dashboard",
        "icon": "Dashboard",
        "route": "/remote/dashboard",
        "order": 1,
        "isActive": true,
        "requiredRoles": [],
        "children": []
      }
    ]
  },
  {
    "id": "admin-app",
    "label": "Administration",
    "icon": "School",
    "route": "/admin",
    "order": 2,
    "isActive": true,
    "requiredRoles": ["admin", "faculty"],
    "children": [...]
  }
]
```

### Create Menu Item
```bash
POST /api/menu
Content-Type: application/json

{
  "id": "new-menu-item",
  "label": "New Menu Item",
  "icon": "Settings",
  "route": "/new/path",
  "parentId": "admin-app",
  "order": 4,
  "requiredRoles": ["admin"]
}
```

## CORS Configuration

The server is configured to accept requests from the micro-frontend applications:
- `http://localhost:3000` (host-app)
- `http://localhost:3001` (admin-app)
- `http://localhost:3002` (remote-app)

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['student', 'faculty', 'admin']),
  studentId: String (unique, sparse),
  department: String,
  year: Number (1-4),
  phone: String,
  address: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Model
```javascript
{
  id: String (required, unique),
  label: String (required),
  icon: String (required, enum: ['Dashboard', 'People', 'School', ...]),
  route: String (required),
  parentId: String (null for root items),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  requiredRoles: Array (enum: ['student', 'faculty', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a JSON object with an `error` field containing the error message.

## Development Notes

- Password hashing is not implemented in this basic version. Consider adding bcrypt for production use.
- Add authentication middleware for protected routes.
- Implement input validation using libraries like Joi or express-validator.
- Add rate limiting for API endpoints.
- Consider adding API documentation with Swagger/OpenAPI.

## Integration with Micro-Frontend Apps

This API server is designed to work with the College Portal micro-frontend architecture:

- **admin-app**: Uses user management and dashboard endpoints, includes MenuList component for menu management
- **host-app**: Consumes general user data and statistics, displays dynamic menu from API
- **remote-app**: Can access shared data through the API

### Menu Management Interface

The admin-app includes a comprehensive **MenuList component** that provides:

- **Visual menu management** with grid layout display
- **Real-time status toggling** (activate/deactivate menu items)
- **Hierarchical display** (main menu vs submenu items)
- **Role-based filtering** and permission management
- **API integration** for CRUD operations on menu items

**Access the Menu Management:**
1. Navigate to `/admin/menu-management` in the host application
2. Or access it directly via the dynamic menu system (requires admin role)
3. The interface connects to the API server at `http://localhost:5000/api/menu`

**Features:**
- View all menu items with their properties (icon, route, roles, order)
- Toggle menu item active/inactive status
- Refresh menu data from API
- Visual indicators for active/inactive items
- Parent-child relationship display

Make sure to update the API base URLs in your frontend applications to point to `http://localhost:`5000``.
