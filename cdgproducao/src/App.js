import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/globalStyles';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import WebhookList from './pages/webhooks';
import FormsList from './pages/forms';
import FormEditor from './pages/forms/FormEditor';
import FormSubmissions from './pages/forms/FormSubmissions';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/webhooks" element={<WebhookList />} />
              <Route path="/forms" element={<FormsList />} />
              <Route path="/forms/new" element={<FormEditor />} />
              <Route path="/forms/:id/edit" element={<FormEditor />} />
              <Route path="/forms/:id/submissions" element={<FormSubmissions />} />
            </Route>
            
            {/* Redirecionar qualquer rota não encontrada para a home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
