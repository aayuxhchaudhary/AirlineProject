import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('airline_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('airline_user');
      return null;
    }
  });

  const loginUser = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('airline_user', JSON.stringify(userData));
    } catch {
      // Ignore quota errors
    }
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('airline_user');
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginUser, 
      logoutUser, 
      isAdmin: user?.role === 'ADMIN',
      isUser: user?.role === 'USER'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
