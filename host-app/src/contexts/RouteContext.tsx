import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface RouteContextType {
  currentRoute: string;
  navigateTo: (route: string) => void;
  isActive: (route: string) => boolean;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    navigate(route);
  };

  const isActive = (route: string) => {
    return currentRoute === route;
  };

  const value = {
    currentRoute,
    navigateTo,
    isActive,
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};
