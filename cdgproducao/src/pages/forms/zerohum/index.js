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

const UnidadeItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  position: relative;
`;

const UnidadeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UnidadeTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.colors.danger || 'red'};
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
`;

const AddButton = styled(Button)`
  margin-top: 1rem;
`;

const ZeroHumForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);

  // Lista de unidades disponíveis no sistema
  const unidadesDisponiveis = [
    { valor: 'ARARUAMA', label: 'Araruama' },
    { valor: 'CABO_FRIO', label: 'Cabo Frio' },
    { valor: 'ITABORAI', label: 'Itaboraí' },
    { valor: 'ITAIPUACU', label: 'Itaipuaçu' },
    { valor: 'MARICA_I', label: 'Maricá I' },
    { valor: 'NOVA_FRIBURGO', label: 'Nova Friburgo' },
    { valor: 'QUEIMADOS', label: 'Queimados' },
    { valor: 'SEROPEDICA', label: 'Seropédica' },
    { valor: 'ALCANTARA', label: 'Alcântara' },
    { valor: 'BANGU', label: 'Bangu' },
    { valor: 'BARRA_DA_TIJUCA', label: 'Barra da Tijuca' },
    { valor: 'BELFORD_ROXO', label: 'Belford Roxo' },
    { valor: 'DUQUE_DE_CAXIAS', label: 'Duque de Caxias' },
    { valor: 'ICARAI', label: 'Icaraí' },
    { valor: 'ILHA_DO_GOVERNADOR', label: 'Ilha do Governador' },
    { valor: 'ITAIPU', label: 'Itaipu' },
    { valor: 'MADUREIRA', label: 'Madureira' },
    { valor: 'MEIER', label: 'Méier' },
    { valor: 'NILOPOLIS', label: 'Nilópolis' },
    { valor: 'NITEROI', label: 'Niterói' },
    { valor: 'NOVA_IGUACU', label: 'Nova Iguaçu' },
    { valor: 'OLARIA', label: 'Olaria' },
    { valor: 'PRATA', label: 'Prata' },
    { valor: 'SAO_GONCALO', label: 'São Gonçalo' },
    { valor: 'SAO_JOAO_DE_MERITI', label: 'São João de Meriti' },
    { valor: 'VILA_ISABEL', label: 'Vila Isabel' },
    { valor: 'VILAR_DOS_TELES', label: 'Vilar dos Teles' }
  ];

  // Função para adicionar uma nova unidade
  const adicionarUnidade = () => {
    setUnidades([...unidades, { nome: '', quantidade: 1 }]);
  };

  // Função para remover uma unidade
  const removerUnidade = (index) => {
    const novasUnidades = [...unidades];
    novasUnidades.splice(index, 1);
    setUnidades(novasUnidades);
  };

  // Função para atualizar uma unidade
  const atualizarUnidade = (index, campo, valor) => {
    const novasUnidades = [...unidades];
    novasUnidades[index][campo] = valor;
    setUnidades(novasUnidades);
  };

  // Validação de formulário
  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
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
        // Validar se pelo menos uma unidade foi adicionada
        if (unidades.length === 0) {
          alert('É necessário adicionar pelo menos uma unidade.');
          setLoading(false);
          return;
        }

        // Validar se todas as unidades têm nome selecionado
        const unidadesInvalidas = unidades.filter(u => !u.nome);
        if (unidadesInvalidas.length > 0) {
          alert('Todas as unidades precisam ter um nome selecionado.');
          setLoading(false);
          return;
        }
        
        // Logging para depuração - verificar unidades
        console.log("Verificando unidades antes do envio:");
        unidades.forEach((unidade, index) => {
          console.log(`Unidade ${index + 1}: Nome=${unidade.nome}, Quantidade=${unidade.quantidade}`);
          
          // Verificar se os dados da unidade são válidos
          if (!unidade.nome || unidade.nome === "") {
            console.error(`Erro: A unidade ${index + 1} não tem um nome válido.`);
          }
          if (!unidade.quantidade || unidade.quantidade < 1) {
            console.error(`Erro: A unidade ${index + 1} não tem uma quantidade válida.`);
          }
        });

        const formData = new FormData();
        
        // Formatar a data para o formato esperado pelo Django (YYYY-MM-DD)
        const formattedValues = {
          ...values,
          data_entrega: values.data_entrega ? new Date(values.data_entrega).toISOString().split('T')[0] : ''
        };
        
        // Adicionar todos os campos base do formulário ao FormData
        Object.keys(formattedValues).forEach(key => {
          formData.append(key, formattedValues[key]);
        });        // Enviar unidades no formato correto para o Django REST Framework
        // O DRF espera um formato específico para nested serializers em multipart/form-data
        unidades.forEach((unidade, index) => {
          formData.append(`unidades[${index}][nome]`, unidade.nome);
          formData.append(`unidades[${index}][quantidade]`, unidade.quantidade);
          console.log(`Adicionando unidade[${index}]:`, unidade.nome, unidade.quantidade);
        });
        
        // Debug - mostrar todos os campos do FormData após adicionar as unidades
        console.log("FormData completo após adicionar unidades:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        // Adicionar o arquivo PDF se existir
        if (arquivo) {
          formData.append('arquivo', arquivo);
        }
          // Mostrar dados que estão sendo enviados (para depuração)
        console.log('Enviando dados para o backend:');
        console.log('Unidades:', unidades);
        
        // Mostrar todos os campos do FormData
        console.log('Conteúdo do FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }        console.log("Enviando para a API com URL correta");
        
        // Enviar para a API - corrigido para o endpoint correto
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
              {/* Seção Unidades */}
            <FormGroup>
              <FormLabel>Informações das Unidades</FormLabel>
              
              {/* Lista de unidades adicionadas */}
              {unidades.map((unidade, index) => (
                <UnidadeItem key={index}>
                  <UnidadeHeader>
                    <UnidadeTitle>Unidade {index + 1}</UnidadeTitle>
                    <DeleteButton 
                      type="button" 
                      onClick={() => removerUnidade(index)}
                      title="Remover unidade"
                    >
                      ×
                    </DeleteButton>
                  </UnidadeHeader>
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Nome da Unidade</FormLabel>
                      <Select
                        value={unidade.nome}
                        onChange={(e) => atualizarUnidade(index, 'nome', e.target.value)}
                        required
                      >
                        <option value="">Selecione uma unidade</option>
                        {unidadesDisponiveis.map((opcao) => (
                          <option key={opcao.valor} value={opcao.valor}>
                            {opcao.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Quantidade</FormLabel>
                      <Input
                        type="number"
                        min="1"
                        value={unidade.quantidade}
                        onChange={(e) => atualizarUnidade(index, 'quantidade', parseInt(e.target.value) || 1)}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                </UnidadeItem>
              ))}
              
              {/* Botão para adicionar nova unidade */}
              <AddButton 
                type="button" 
                variant="outlined" 
                onClick={adicionarUnidade}
                title="Adicionar nova unidade"
              >
                + Adicionar Unidade
              </AddButton>
              
              {unidades.length === 0 && (
                <div style={{ marginTop: '0.5rem', color: '#666' }}>
                  Por favor, adicione pelo menos uma unidade.
                </div>
              )}
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
