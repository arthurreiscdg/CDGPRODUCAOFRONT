import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card, { CardHeader, CardTitle } from '../../components/Card';
import api from '../../services/api';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
`;

const BadgeContainer = styled.div`
  display: inline-block;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  text-transform: uppercase;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'published':
        return theme.colors.success + '20';
      case 'draft':
        return theme.colors.secondary + '20';
      default:
        return theme.colors.info + '20';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'published':
        return theme.colors.success;
      case 'draft':
        return theme.colors.secondary;
      default:
        return theme.colors.info;
    }
  }};
`;

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      // Em um ambiente real, você buscaria dados da API
      // const response = await api.get('/forms');
      // setForms(response.data);
      
      // Simulando dados para exemplo
      setTimeout(() => {
        setForms([
          { id: 1, name: 'Cadastro de Cliente', description: 'Formulário para cadastro de novos clientes', status: 'published', fields: 8, submissions: 156, updatedAt: '2025-05-10T12:30:00' },
          { id: 2, name: 'Pesquisa de Satisfação', description: 'Avaliação pós-atendimento', status: 'published', fields: 5, submissions: 423, updatedAt: '2025-05-11T10:15:00' },
          { id: 3, name: 'Solicitação de Suporte', description: 'Formulário para solicitações de suporte técnico', status: 'published', fields: 6, submissions: 78, updatedAt: '2025-05-12T09:45:00' },
          { id: 4, name: 'Contratação de Serviços', description: 'Formulário para contratação de novos serviços', status: 'draft', fields: 12, submissions: 0, updatedAt: '2025-05-13T14:20:00' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      setLoading(false);
    }
  };

  const handleAddForm = () => {
    navigate('/forms/new');
  };

  const handleEditForm = (form) => {
    navigate(`/forms/${form.id}/edit`);
  };

  const handleViewSubmissions = (form) => {
    navigate(`/forms/${form.id}/submissions`);
  };

  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Descrição', accessor: 'description' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <BadgeContainer>
          <StatusBadge status={row.status}>
            {row.status === 'published' ? 'Publicado' : 'Rascunho'}
          </StatusBadge>
        </BadgeContainer>
      )
    },
    { header: 'Campos', accessor: 'fields' },
    { header: 'Submissões', accessor: 'submissions' },
    { 
      header: 'Última Atualização', 
      accessor: 'updatedAt',
      render: (row) => {
        const date = new Date(row.updatedAt);
        return date.toLocaleDateString('pt-BR');
      }
    },
    { 
      header: 'Ações', 
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="small" onClick={() => handleEditForm(row)}>Editar</Button>
          <Button size="small" variant="outlined" onClick={() => handleViewSubmissions(row)}>Ver Respostas</Button>
        </div>
      )
    },
  ];

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Gerenciamento de Formulários</PageTitle>
        <Button onClick={handleAddForm}>Criar Formulário</Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Formulários</CardTitle>
        </CardHeader>
        {loading ? (
          <div style={{ padding: '1rem' }}>Carregando...</div>
        ) : (
          <Table columns={columns} data={forms} />
        )}
      </Card>
    </MainLayout>
  );
};

export default FormsList;
