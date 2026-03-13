import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, updateProfileApi } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore session from stored token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const result = await getMeApi();
        if (result.success) {
          setUser(result.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const result = await loginApi(email, password);
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.user.role);
      setUser(result.user);
    }
    return result;
  };

  const register = async (name, email, password, role = 'student') => {
    const result = await registerApi(name, email, password, role);
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.user.role);
      setUser(result.user);
    }
    return result;
  };

  const updateProfile = async (updates) => {
    const result = await updateProfileApi(updates);
    if (result.success) setUser((prev) => ({ ...prev, ...result.user }));
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  // Dev helper — switch role without re-login
  const __devSwitchRole = (newRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
      localStorage.setItem('role', newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, __devSwitchRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};