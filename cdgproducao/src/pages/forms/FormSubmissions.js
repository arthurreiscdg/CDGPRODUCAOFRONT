import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

const FormSubmissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForm();
    fetchSubmissions();
  }, [id]);

  const fetchForm = async () => {
    try {
      // Em um ambiente real, você buscaria dados da API
      // const response = await api.get(`/forms/${id}`);
      // setForm(response.data);
      
      // Simulando dados para exemplo
      setTimeout(() => {
        setForm({
          id: parseInt(id),
          name: 'Cadastro de Cliente',
          description: 'Formulário para cadastro de novos clientes',
          status: 'published',
          fields: [
            { id: 'field_1', type: 'text', label: 'Nome Completo', required: true },
            { id: 'field_2', type: 'email', label: 'Email', required: true },
            { id: 'field_3', type: 'phone', label: 'Telefone', required: false },
            { id: 'field_4', type: 'select', label: 'Como nos conheceu', required: false, options: [
              { label: 'Google', value: 'google' },
              { label: 'Redes Sociais', value: 'social' },
              { label: 'Indicação', value: 'referral' },
              { label: 'Outro', value: 'other' },
            ]},
          ]
        });
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar formulário:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      // Em um ambiente real, você buscaria dados da API
      // const response = await api.get(`/forms/${id}/submissions`);
      // setSubmissions(response.data);
      
      // Simulando dados para exemplo
      setTimeout(() => {
        setSubmissions([
          { 
            id: 1, 
            createdAt: '2025-05-10T14:30:00',
            data: { 
              'field_1': 'João Silva',
              'field_2': 'joao@exemplo.com',
              'field_3': '(11) 99999-8888',
              'field_4': 'google'
            }
          },
          { 
            id: 2, 
            createdAt: '2025-05-11T09:15:00',
            data: { 
              'field_1': 'Maria Souza',
              'field_2': 'maria@exemplo.com',
              'field_3': '(21) 98765-4321',
              'field_4': 'referral'
            }
          },
          { 
            id: 3, 
            createdAt: '2025-05-12T16:45:00',
            data: { 
              'field_1': 'Carlos Santos',
              'field_2': 'carlos@exemplo.com',
              'field_3': '(31) 97654-3210',
              'field_4': 'social'
            }
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar submissões:', error);
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Lógica para exportar os dados
    alert('Funcionalidade de exportar será implementada em breve!');
  };

  // Construir colunas com base nos campos do formulário
  const buildColumns = () => {
    if (!form) return [];

    const baseColumns = [
      { 
        header: 'ID', 
        accessor: 'id',
      },
      { 
        header: 'Data de Envio', 
        accessor: 'createdAt',
        render: (row) => {
          const date = new Date(row.createdAt);
          return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      },
    ];

    // Adicionar colunas dinamicamente com base nos campos do formulário
    const fieldColumns = form.fields.map(field => ({
      header: field.label,
      accessor: field.id,
      render: (row) => {
        const value = row.data[field.id];
        
        if (!value) return '-';
        
        // Se for uma opção de um campo select, mostrar o label
        if (field.type === 'select' && field.options) {
          const option = field.options.find(opt => opt.value === value);
          return option ? option.label : value;
        }
        
        return value;
      }
    }));

    return [...baseColumns, ...fieldColumns];
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>
          {form ? `Respostas - ${form.name}` : 'Respostas do Formulário'}
        </PageTitle>
        <div>
          <Button variant="outlined" onClick={() => navigate('/forms')} style={{ marginRight: '0.5rem' }}>
            Voltar
          </Button>
          <Button onClick={handleExport}>
            Exportar CSV
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Submissões Recebidas</CardTitle>
        </CardHeader>
        {loading ? (
          <div style={{ padding: '1rem' }}>Carregando...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '1rem' }}>Nenhuma submissão encontrada.</div>
        ) : (
          <Table columns={buildColumns()} data={submissions} />
        )}
      </Card>
    </MainLayout>
  );
};

export default FormSubmissions;
