import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../../components/MainLayout';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Card, { CardHeader, CardTitle } from '../../components/Card';
import api from '../../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
      case 'active':
        return theme.colors.success + '20';
      case 'inactive':
        return theme.colors.secondary + '20';
      case 'error':
        return theme.colors.danger + '20';
      default:
        return theme.colors.info + '20';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.secondary;
      case 'error':
        return theme.colors.danger;
      default:
        return theme.colors.info;
    }
  }};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  > * {
    flex: 1;
  }
`;

const WebhookList = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      // Em um ambiente real, você buscaria dados da API
      // const response = await api.get('/webhooks');
      // setWebhooks(response.data);
      
      // Simulando dados para exemplo
      setTimeout(() => {
        setWebhooks([
          { id: 1, name: 'Novo pedido', url: 'https://api.example.com/orders', status: 'active', method: 'POST', headers: { 'Content-Type': 'application/json' }, createdAt: '2025-05-10T12:30:00' },
          { id: 2, name: 'Pagamento confirmado', url: 'https://api.example.com/payments', status: 'active', method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': '123456' }, createdAt: '2025-05-11T10:15:00' },
          { id: 3, name: 'Envio de NF', url: 'https://api.example.com/invoices', status: 'inactive', method: 'POST', headers: { 'Content-Type': 'application/json' }, createdAt: '2025-05-12T09:45:00' },
          { id: 4, name: 'Notificação cliente', url: 'https://api.example.com/notifications', status: 'error', method: 'POST', headers: { 'Content-Type': 'application/json' }, createdAt: '2025-05-13T14:20:00' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar webhooks:', error);
      setLoading(false);
    }
  };

  const handleAddWebhook = () => {
    setIsEditMode(false);
    setSelectedWebhook(null);
    formik.resetForm();
    setIsModalOpen(true);
  };

  const handleEditWebhook = (webhook) => {
    setIsEditMode(true);
    setSelectedWebhook(webhook);
    formik.setValues({
      name: webhook.name,
      url: webhook.url,
      method: webhook.method,
      status: webhook.status,
      headers: JSON.stringify(webhook.headers, null, 2),
    });
    setIsModalOpen(true);
  };

  const handleDeleteWebhook = (webhook) => {
    setSelectedWebhook(webhook);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteWebhook = async () => {
    try {
      // Em um ambiente real, você enviaria para a API
      // await api.delete(`/webhooks/${selectedWebhook.id}`);
      
      // Simulando para exemplo
      setWebhooks(webhooks.filter(webhook => webhook.id !== selectedWebhook.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar webhook:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      url: '',
      method: 'POST',
      status: 'active',
      headers: '{\n  "Content-Type": "application/json"\n}',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      url: Yup.string().url('URL inválida').required('URL é obrigatória'),
      method: Yup.string().required('Método é obrigatório'),
      status: Yup.string().required('Status é obrigatório'),
      headers: Yup.string().test(
        'is-valid-json',
        'Headers deve ser um JSON válido',
        value => {
          try {
            JSON.parse(value);
            return true;
          } catch (error) {
            return false;
          }
        }
      ),
    }),
    onSubmit: async (values) => {
      try {
        // Convertendo headers string para objeto
        const headersObj = JSON.parse(values.headers);

        const webhookData = {
          ...values,
          headers: headersObj,
        };

        if (isEditMode && selectedWebhook) {
          // Em um ambiente real, você enviaria para a API
          // await api.put(`/webhooks/${selectedWebhook.id}`, webhookData);
          
          // Simulando para exemplo
          const updatedWebhooks = webhooks.map(webhook => 
            webhook.id === selectedWebhook.id ? { ...webhook, ...webhookData } : webhook
          );
          setWebhooks(updatedWebhooks);
        } else {
          // Em um ambiente real, você enviaria para a API
          // const response = await api.post('/webhooks', webhookData);
          
          // Simulando para exemplo
          const newWebhook = {
            id: webhooks.length + 1,
            ...webhookData,
            createdAt: new Date().toISOString()
          };
          setWebhooks([...webhooks, newWebhook]);
        }

        setIsModalOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error('Erro ao salvar webhook:', error);
      }
    },
  });

  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'URL', accessor: 'url' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <BadgeContainer>
          <StatusBadge status={row.status}>
            {row.status === 'active' ? 'Ativo' : row.status === 'inactive' ? 'Inativo' : 'Erro'}
          </StatusBadge>
        </BadgeContainer>
      )
    },
    { header: 'Método', accessor: 'method' },
    { 
      header: 'Data de Criação', 
      accessor: 'createdAt',
      render: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString('pt-BR');
      }
    },
    { 
      header: 'Ações', 
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="small" onClick={() => handleEditWebhook(row)}>Editar</Button>
          <Button size="small" variant="outlined" onClick={() => handleDeleteWebhook(row)}>Excluir</Button>
        </div>
      )
    },
  ];

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Gerenciamento de Webhooks</PageTitle>
        <Button onClick={handleAddWebhook}>Adicionar Webhook</Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Webhooks</CardTitle>
        </CardHeader>
        {loading ? (
          <div style={{ padding: '1rem' }}>Carregando...</div>
        ) : (
          <Table columns={columns} data={webhooks} />
        )}
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Editar Webhook' : 'Adicionar Webhook'}
        footer={
          <>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={formik.handleSubmit}>
              {formik.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <Form onSubmit={formik.handleSubmit}>
          <Input
            id="name"
            name="name"
            label="Nome"
            placeholder="Nome do webhook"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />
          
          <Input
            id="url"
            name="url"
            label="URL"
            placeholder="https://exemplo.com/webhook"
            fullWidth
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && formik.errors.url}
          />

          <FormRow>
            <div>
              <label htmlFor="method">Método</label>
              <select
                id="method"
                name="method"
                value={formik.values.method}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da'
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              {formik.touched.method && formik.errors.method && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {formik.errors.method}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da'
                }}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="error">Erro</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {formik.errors.status}
                </div>
              )}
            </div>
          </FormRow>
          
          <div>
            <label htmlFor="headers">Headers (JSON)</label>
            <textarea
              id="headers"
              name="headers"
              rows="5"
              value={formik.values.headers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                border: '1px solid #ced4da',
                fontFamily: 'monospace'
              }}
            />
            {formik.touched.headers && formik.errors.headers && (
              <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {formik.errors.headers}
              </div>
            )}
          </div>
        </Form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteWebhook}>Confirmar</Button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir o webhook "{selectedWebhook?.name}"?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </MainLayout>
  );
};

export default WebhookList;
