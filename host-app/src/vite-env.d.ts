/// <reference types="vite/client" />

declare module 'remoteApp/Button' {
  const Button: React.ComponentType<{
    text: string;
    onClick?: () => void;
  }>;
  export default Button;
}

declare module 'remoteApp/Card' {
  const Card: React.ComponentType<{}>;
  export default Card;
}

declare module 'adminApp/AdminDashboard' {
  const AdminDashboard: React.ComponentType<{}>;
  export default AdminDashboard;
}

declare module 'adminApp/UserManagement' {
  const UserManagement: React.ComponentType<{}>;
  export default UserManagement;
}

declare module 'adminApp/MenuManagement' {
  const MenuManagement: React.ComponentType<{}>;
  export default MenuManagement;
}

declare module 'remoteApp/Login' {
  const Login: React.ComponentType<{}>;
  export default Login;
}