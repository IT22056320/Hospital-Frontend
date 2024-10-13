import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

// Define the shape of your context, including setUser
interface AuthContextType {
  user: { username: string; email: string; role: string } | null;
  login: (user: { username: string; email: string; role: string }, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: string | null;
}

// Initial context value
const initialAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  role: null,
};

// Create the context
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle login
  const login = (user: { username: string; email: string; role: string }, token: string) => {
    setUser(user);
    setRole(user.role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token); // Store token in localStorage
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Clear token on logout
    setIsAuthenticated(false);
  };

  // Load user and role from localStorage if available on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token'); // Check for token
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Check if context is undefined (which means it's used outside of the provider)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
};
