import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../../../components/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import api from '../../../services/api';
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
  flex-wrap: wrap;
  
  > * {
    flex: 1;
    min-width: 250px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

// Componente Select personalizado
const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? 'red' : '#ddd'};
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

// Componente para upload de arquivos
const FileInput = styled.div`
  margin-bottom: 1rem;
  
  input[type="file"] {
    display: block;
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .error-text {
    color: red;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? 'red' : '#ddd'};
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

const ZeroHumForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [arquivo, setArquivo] = useState(null);

  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    unidade_nome: Yup.string().required('Nome da unidade é obrigatório'),
    unidade_quantidade: Yup.number().integer('Deve ser um número inteiro').positive('Deve ser positivo').required('Quantidade é obrigatória'),
    titulo: Yup.string().required('Título é obrigatório'),
    data_entrega: Yup.date().required('Data de entrega é obrigatória').min(new Date(), 'A data de entrega não pode ser anterior a hoje'),
    formato: Yup.string().required('Formato é obrigatório'),
    cor_impressao: Yup.string().required('Cor de impressão é obrigatória'),
    impressao: Yup.string().required('Tipo de impressão é obrigatório'),
    observacoes: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      unidade_nome: '',
      unidade_quantidade: 1,
      titulo: '',
      data_entrega: '',
      observacoes: '',
      formato: 'A4',
      cor_impressao: 'PB',
      impressao: '1_LADO'
    },
    validationSchema,    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        
        // Formatar a data para o formato esperado pelo Django (YYYY-MM-DD)
        const formattedValues = {
          ...values,
          data_entrega: values.data_entrega ? new Date(values.data_entrega).toISOString().split('T')[0] : ''
        };
        
        // Adicionar todos os campos do formulário ao FormData
        Object.keys(formattedValues).forEach(key => {
          formData.append(key, formattedValues[key]);
        });// Adicionar o arquivo PDF se existir
        if (arquivo) {
          formData.append('arquivo', arquivo);
        }        // Mostrar dados que estão sendo enviados (para depuração)
        console.log('Enviando dados para o backend:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        // Enviar para a API
        const response = await api.post('/formularios/zerohum/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Formulário enviado com sucesso:', response.data);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate('/forms');
        }, 3000);      } catch (error) {
        console.error("Erro ao salvar formulário:", error);
        
        // Mostrar mensagem de erro mais detalhada, se disponível
        let errorMessage = 'Erro ao enviar o formulário. Por favor, tente novamente.';
        
        if (error.response) {
          // O servidor respondeu com um status de erro
          console.error('Dados da resposta de erro:', error.response.data);
          console.error('Status do erro:', error.response.status);
          
          if (error.response.data && error.response.data.errors) {
            const errorDetails = Object.entries(error.response.data.errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('\n');
            
            errorMessage = `Erro na validação dos dados: \n${errorDetails}`;
          } else if (error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        }
        
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  });

  // Handler para upload de arquivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar se é um PDF
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie apenas arquivos PDF.');
        return;
      }
      setArquivo(file);
    }
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Formulário ZeroHum</PageTitle>
        <div>
          <Button variant="outlined" onClick={() => navigate('/forms')} style={{ marginRight: '1rem' }}>
            Voltar
          </Button>
          <Button 
            type="button" 
            onClick={() => formik.handleSubmit()}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Formulário</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={formik.handleSubmit}>
            {/* Seção de Contato */}
            <FormGroup>
              <FormLabel>Informações de Contato</FormLabel>
              <FormRow>
                <Input
                  id="nome"
                  name="nome"
                  label="Nome"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nome && formik.errors.nome}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  label="E-mail"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                  required
                />
              </FormRow>
            </FormGroup>
            
            {/* Seção Unidade */}
            <FormGroup>
              <FormLabel>Informações da Unidade</FormLabel>
              <FormRow>
                <Input
                  id="unidade_nome"
                  name="unidade_nome"
                  label="Nome da Unidade"
                  value={formik.values.unidade_nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.unidade_nome && formik.errors.unidade_nome}
                  required
                />
                <Input
                  id="unidade_quantidade"
                  name="unidade_quantidade"
                  label="Quantidade"
                  type="number"
                  min="1"
                  value={formik.values.unidade_quantidade}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.unidade_quantidade && formik.errors.unidade_quantidade}
                  required
                />
              </FormRow>
            </FormGroup>
            
            {/* Seção de Configuração de Impressão */}
            <FormGroup>
              <FormLabel>Configurações de Impressão</FormLabel>
              <FormRow>
                <Input
                  id="titulo"
                  name="titulo"
                  label="Título"
                  value={formik.values.titulo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.titulo && formik.errors.titulo}
                  required
                />
                <Input
                  id="data_entrega"
                  name="data_entrega"
                  label="Data de Entrega"
                  type="date"
                  value={formik.values.data_entrega}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.data_entrega && formik.errors.data_entrega}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Formato</FormLabel>
                  <Select
                    id="formato"
                    name="formato"
                    value={formik.values.formato}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.formato && formik.errors.formato}
                  >
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="A3">A3</option>
                    <option value="CARTA">Carta</option>
                    <option value="OFICIO">Ofício</option>
                    <option value="OUTRO">Outro</option>
                  </Select>
                  {formik.touched.formato && formik.errors.formato && (
                    <div className="error-text">{formik.errors.formato}</div>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Cor de Impressão</FormLabel>
                  <Select
                    id="cor_impressao"
                    name="cor_impressao"
                    value={formik.values.cor_impressao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cor_impressao && formik.errors.cor_impressao}
                  >
                    <option value="PB">Preto e Branco</option>
                    <option value="COLOR">Colorido</option>
                  </Select>
                  {formik.touched.cor_impressao && formik.errors.cor_impressao && (
                    <div className="error-text">{formik.errors.cor_impressao}</div>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Tipo de Impressão</FormLabel>
                  <Select
                    id="impressao"
                    name="impressao"
                    value={formik.values.impressao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.impressao && formik.errors.impressao}
                  >
                    <option value="1_LADO">Um lado</option>
                    <option value="2_LADOS">Frente e verso</option>
                    <option value="LIVRETO">Livreto</option>
                  </Select>
                  {formik.touched.impressao && formik.errors.impressao && (
                    <div className="error-text">{formik.errors.impressao}</div>
                  )}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel>Observações</FormLabel>
                <TextArea
                  id="observacoes"
                  name="observacoes"
                  value={formik.values.observacoes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.observacoes && formik.errors.observacoes}
                  placeholder="Informações adicionais sobre o formulário..."
                />
                {formik.touched.observacoes && formik.errors.observacoes && (
                  <div className="error-text">{formik.errors.observacoes}</div>
                )}
              </FormGroup>
            </FormGroup>
            
            {/* Seção de Upload de Arquivo */}
            <FormGroup>
              <FormLabel>Upload de Arquivo PDF</FormLabel>
              <FileInput>
                <input
                  type="file"
                  id="arquivo"
                  name="arquivo"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {arquivo && (
                  <div style={{marginTop: '0.5rem'}}>
                    Arquivo selecionado: {arquivo.name}
                  </div>
                )}
              </FileInput>
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {saved && <span style={{ color: 'green' }}>Formulário salvo com sucesso!</span>}
            <div>
              <Button variant="outlined" onClick={() => navigate('/forms')} style={{ marginRight: '1rem' }}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={() => formik.handleSubmit()}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default ZeroHumForm;
