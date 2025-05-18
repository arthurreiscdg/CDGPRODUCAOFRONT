import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

// Estilos reutilizados do componente de login
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 500px;
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
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
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

const Register = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      password2: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required('Nome é obrigatório'),
      lastName: Yup.string()
        .required('Sobrenome é obrigatório'),
      username: Yup.string()
        .required('Nome de usuário é obrigatório')
        .min(4, 'Nome de usuário deve ter pelo menos 4 caracteres'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória')
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
      password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
        .required('Confirmação de senha é obrigatória'),
    }),
    onSubmit: async (values) => {
      setRegisterError(null);
      try {
        await api.post('/auth/register/', {
          first_name: values.firstName,
          last_name: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
          password2: values.password2,
        });
        
        navigate('/login', { state: { message: 'Registro concluído com sucesso. Faça login para continuar.' } });
      } catch (error) {
        const errorMsg = error.response?.data?.username || 
                         error.response?.data?.email || 
                         error.response?.data?.password ||
                         'Erro ao registrar. Por favor, tente novamente.';
                         
        setRegisterError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
      }
    },
  });

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>CDG Produção - Cadastro</Logo>
        
        {registerError && <ErrorMessage>{registerError}</ErrorMessage>}
        
        <Form onSubmit={formik.handleSubmit}>
          <FormRow>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label="Nome"
              placeholder="Seu nome"
              fullWidth
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && formik.errors.firstName}
            />
            
            <Input
              id="lastName"
              name="lastName"
              type="text"
              label="Sobrenome"
              placeholder="Seu sobrenome"
              fullWidth
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && formik.errors.lastName}
            />
          </FormRow>
          
          <Input
            id="username"
            name="username"
            type="text"
            label="Nome de usuário"
            placeholder="Escolha um nome de usuário"
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />
          
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
            placeholder="Escolha uma senha"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />
          
          <Input
            id="password2"
            name="password2"
            type="password"
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            fullWidth
            value={formik.values.password2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password2 && formik.errors.password2}
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processando...' : 'Criar conta'}
          </Button>
        </Form>
        
        <LoginLink>
          Já possui uma conta? <Link to="/login">Faça login</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
