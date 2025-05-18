import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../../components/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
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

const FormBuilderContainer = styled.div`
  margin-top: 1.5rem;
`;

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.white};
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FieldActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FieldSettings = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.light};
`;

const AddFieldButton = styled(Button)`
  margin-top: 1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.dark};
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';
  const [activeTab, setActiveTab] = useState('basic');
  const [fields, setFields] = useState([]);
  const [openFieldId, setOpenFieldId] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      status: 'draft',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      description: Yup.string(),
      status: Yup.string().required('Status é obrigatório'),
    }),
    onSubmit: (values) => {
      saveForm({
        ...values,
        fields,
      });
    },
  });

  const saveForm = async (formData) => {
    try {
      if (isEditMode) {
        // Em um ambiente real, você enviaria para a API
        // await api.put(`/forms/${id}`, formData);
        console.log('Atualizando formulário:', formData);
      } else {
        // Em um ambiente real, você enviaria para a API
        // await api.post('/forms', formData);
        console.log('Criando formulário:', formData);
      }
      navigate('/forms');
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
    }
  };

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: 'Novo campo',
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? [
        { label: 'Opção 1', value: 'option1' },
        { label: 'Opção 2', value: 'option2' },
      ] : [],
    };
    setFields([...fields, newField]);
    setOpenFieldId(newField.id);
  };

  const updateField = (id, updates) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
    if (openFieldId === id) {
      setOpenFieldId(null);
    }
  };

  const toggleFieldSettings = (id) => {
    setOpenFieldId(openFieldId === id ? null : id);
  };

  const moveField = (id, direction) => {
    const index = fields.findIndex(field => field.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newFields = [...fields];
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      setFields(newFields);
    }
    
    if (direction === 'down' && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setFields(newFields);
    }
  };

  const renderFieldEditor = (field) => {
    return (
      <FieldItem key={field.id}>
        <FieldHeader>
          <div>
            <strong>{field.label || 'Campo sem nome'}</strong>
            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Tipo: {getFieldTypeName(field.type)}
              {field.required && ' • Obrigatório'}
            </div>
          </div>
          <FieldActions>
            <Button size="small" onClick={() => toggleFieldSettings(field.id)}>
              {openFieldId === field.id ? 'Esconder' : 'Editar'}
            </Button>
            <Button size="small" variant="outlined" onClick={() => removeField(field.id)}>
              Remover
            </Button>
          </FieldActions>
        </FieldHeader>
        
        <FieldSettings isOpen={openFieldId === field.id}>
          <FormRow>
            <Input
              label="ID do Campo"
              value={field.id}
              disabled
            />
            <Input
              label="Tipo"
              value={getFieldTypeName(field.type)}
              disabled
            />
          </FormRow>
          
          <Input
            label="Nome do Campo"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
          
          <Input
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id={`required_${field.id}`}
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
            />
            <label htmlFor={`required_${field.id}`}>Campo obrigatório</label>
          </div>
          
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div>
              <label>Opções</label>
              {field.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Input
                    placeholder="Rótulo"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...field.options];
                      newOptions[index].label = e.target.value;
                      updateField(field.id, { options: newOptions });
                    }}
                  />
                  <Input
                    placeholder="Valor"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...field.options];
                      newOptions[index].value = e.target.value;
                      updateField(field.id, { options: newOptions });
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const newOptions = field.options.filter((_, i) => i !== index);
                      updateField(field.id, { options: newOptions });
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button
                size="small"
                onClick={() => {
                  const newOptions = [...field.options, { label: `Opção ${field.options.length + 1}`, value: `option${field.options.length + 1}` }];
                  updateField(field.id, { options: newOptions });
                }}
              >
                Adicionar Opção
              </Button>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              <Button
                size="small"
                variant="outlined"
                onClick={() => moveField(field.id, 'up')}
                disabled={fields.findIndex(f => f.id === field.id) === 0}
              >
                ↑ Mover para Cima
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => moveField(field.id, 'down')}
                disabled={fields.findIndex(f => f.id === field.id) === fields.length - 1}
                style={{ marginLeft: '0.5rem' }}
              >
                ↓ Mover para Baixo
              </Button>
            </div>
          </div>
        </FieldSettings>
      </FieldItem>
    );
  };

  const getFieldTypeName = (type) => {
    const types = {
      text: 'Texto',
      textarea: 'Área de Texto',
      number: 'Número',
      email: 'Email',
      phone: 'Telefone',
      date: 'Data',
      select: 'Seleção',
      radio: 'Botões de Opção',
      checkbox: 'Caixas de Seleção',
      file: 'Arquivo',
    };
    return types[type] || type;
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>{isEditMode ? 'Editar Formulário' : 'Novo Formulário'}</PageTitle>
        <div>
          <Button variant="outlined" onClick={() => navigate('/forms')} style={{ marginRight: '0.5rem' }}>
            Cancelar
          </Button>
          <Button onClick={formik.handleSubmit}>
            Salvar
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Editor de Formulário</CardTitle>
        </CardHeader>
        <CardBody>
          <TabsContainer>
            <Tab
              active={activeTab === 'basic'}
              onClick={() => setActiveTab('basic')}
            >
              Informações Básicas
            </Tab>
            <Tab
              active={activeTab === 'fields'}
              onClick={() => setActiveTab('fields')}
            >
              Campos
            </Tab>
          </TabsContainer>

          {activeTab === 'basic' && (
            <Form>
              <Input
                id="name"
                name="name"
                label="Nome do Formulário"
                placeholder="Ex: Formulário de Contato"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name}
              />
              
              <div>
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Descreva o propósito deste formulário"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #ced4da'
                  }}
                />
                {formik.touched.description && formik.errors.description && (
                  <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formik.errors.description}
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
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formik.errors.status}
                  </div>
                )}
              </div>
            </Form>
          )}

          {activeTab === 'fields' && (
            <FormBuilderContainer>
              <h3>Campos do Formulário</h3>
              {fields.length === 0 ? (
                <p>Nenhum campo adicionado. Adicione campos abaixo.</p>
              ) : (
                <FieldList>
                  {fields.map(field => renderFieldEditor(field))}
                </FieldList>
              )}
              
              <Card withBorder style={{ marginTop: '1.5rem' }}>
                <CardHeader>
                  <CardTitle>Adicionar Novo Campo</CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Button size="small" onClick={() => addField('text')}>Texto</Button>
                    <Button size="small" onClick={() => addField('textarea')}>Área de Texto</Button>
                    <Button size="small" onClick={() => addField('number')}>Número</Button>
                    <Button size="small" onClick={() => addField('email')}>Email</Button>
                    <Button size="small" onClick={() => addField('phone')}>Telefone</Button>
                    <Button size="small" onClick={() => addField('date')}>Data</Button>
                    <Button size="small" onClick={() => addField('select')}>Seleção</Button>
                    <Button size="small" onClick={() => addField('radio')}>Botões de Opção</Button>
                    <Button size="small" onClick={() => addField('checkbox')}>Caixas de Seleção</Button>
                    <Button size="small" onClick={() => addField('file')}>Arquivo</Button>
                  </div>
                </CardBody>
              </Card>
            </FormBuilderContainer>
          )}
        </CardBody>
        <CardFooter>
          <Button variant="outlined" onClick={() => navigate('/forms')} style={{ marginRight: '0.5rem' }}>
            Cancelar
          </Button>
          <Button onClick={formik.handleSubmit}>
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default FormEditor;
