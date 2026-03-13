import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When app loads, check if we have a token and fetch user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This will be replaced with your actual /users/me or auth/verify endpoint
          // const response = await api.get('/auth/me');
          // setUser(response.data);
          
          // MOCK for now based on purely having a token:
          setUser({
            name: "Alex Carter",
            email: "alex@example.com",
            role: localStorage.getItem('role') || "student" // "student", "instructor", "admin"
          });
        } catch (error) {
          console.error("Auth initialization failed", error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // ACTUAL API CALL (Uncomment when backend is ready)
      // const response = await api.post('/login', { email, password });
      // const { token, user } = response.data;
      
      // MOCK BACKEND RESPONSE:
      const token = "mock-jwt-token";
      const baseUser = { email, name: email.split('@')[0] };
      let assignedRole = "student";
      
      // Fake role assignment logic using email handle for testing purposes
      if (email.includes("admin")) assignedRole = "admin";
      else if (email.includes("instructor")) assignedRole = "instructor";
      
      const mockUser = { ...baseUser, role: assignedRole };
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', mockUser.role);
      setUser(mockUser);
      return { success: true };
    } catch (error) {
       return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = "student") => {
    try {
      // ACTUAL API CALL
      // await api.post('/register', { name, email, password, role });
      
      // MOCK BACKEND RESULT: Log them right in
      const token = "mock-jwt-token";
      const mockUser = { email, name, role };
      localStorage.setItem('token', token);
      localStorage.setItem('role', mockUser.role);
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  // Optional: Function to manually switch roles during development
  const __devSwitchRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('role', newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, __devSwitchRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};