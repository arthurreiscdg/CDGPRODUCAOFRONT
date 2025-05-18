import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      const storedUser = localStorage.getItem('@CDGProducao:user');
      const storedToken = localStorage.getItem('@CDGProducao:token');

      if (storedUser && storedToken) {
        api.defaults.headers.authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    }

    loadStoredData();
  }, []);

  const signIn = async (credentials) => {
    try {
      // Substitua pela sua URL de API real
      const response = await api.post('/sessions', credentials);

      const { token, user: userData } = response.data;
      
      localStorage.setItem('@CDGProducao:user', JSON.stringify(userData));
      localStorage.setItem('@CDGProducao:token', token);
      
      api.defaults.headers.authorization = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem('@CDGProducao:user');
    localStorage.removeItem('@CDGProducao:token');
    
    api.defaults.headers.authorization = null;
    
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      loading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export default AuthContext;
