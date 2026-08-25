import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('airline_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('airline_admin', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('airline_admin');
  };

  return (
    <AuthContext.Provider value={{ admin, loginAdmin, logoutAdmin, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
