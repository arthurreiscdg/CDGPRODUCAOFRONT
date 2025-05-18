import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória'),
    }),
    onSubmit: async (values) => {
      setLoginError(null); // Limpa erros anteriores
      try {
        const response = await signIn(values);
        if (response.success) {
          navigate('/');
        } else {
          setLoginError(response.error);
        }
      } catch (error) {
        setLoginError('Erro de conexão com o servidor. Tente novamente.');
        console.error('Erro de login:', error);
      }
    },
  });

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>CDG Produção</Logo>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        <Form onSubmit={formik.handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Seu email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="Sua senha"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />          <Button
            type="submit"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem'}}>
          Não possui uma conta? <Link to="/register" style={{color: theme.colors.primary}}>Cadastre-se</Link>
        </p>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
