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
        try {
          // Verificar se o token ainda é válido
          const response = await api.get('/auth/user/');
          setUser(response.data);
        } catch (error) {
          // Se houver erro, limpar armazenamento local
          localStorage.removeItem('@CDGProducao:user');
          localStorage.removeItem('@CDGProducao:token');
        }
      }
      
      setLoading(false);
    }

    loadStoredData();
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await api.post('/auth/login/', {
        username: credentials.email, // Estamos usando o email como username
        password: credentials.password
      });

      const { user: userData, token } = response.data;
      
      localStorage.setItem('@CDGProducao:user', JSON.stringify(userData));
      localStorage.setItem('@CDGProducao:token', token);
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Erro ao fazer login. Verifique suas credenciais.'
      };
    }
  };
  const signOut = async () => {
    try {
      // Chamar o endpoint de logout do backend
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Remover dados do localStorage e estado independente do resultado da chamada de API
      localStorage.removeItem('@CDGProducao:user');
      localStorage.removeItem('@CDGProducao:token');
      setUser(null);
    }
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
