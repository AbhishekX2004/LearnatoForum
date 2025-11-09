import React, { useState, useEffect } from 'react';
import api from '../api';
import { Spinner } from '../components/Spinner';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) return <Spinner fullPage />;

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
