import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

// Define the shape of your context, including setUser
interface AuthContextType {
  user: { username: string; email: string } | null;
  login: (user: { username: string; email: string }) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<{ username: string; email: string } | null>>;
  isAuthenticated: boolean;
}

// Initial context value
const initialAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  isAuthenticated: false,
};

// Create the context
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  // Derive `isAuthenticated` from the presence of a user
  const isAuthenticated = !!user;

  // Function to handle login
  const login = (user: { username: string; email: string }) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Optionally persist user data in localStorage
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear the persisted user data
  };

  // Load user from localStorage if available on app load (optional)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, isAuthenticated }}>
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
