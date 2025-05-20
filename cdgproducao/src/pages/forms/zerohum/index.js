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

// Componentes estilizados
const FormContainer = styled.div`
  padding: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const UnidadeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const UnidadeItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #f8f8f8;
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  
  @media (min-width: 768px) {
    width: calc(50% - 5px);
  }
`;

const UnidadeSelect = styled(SelectField)`
  flex: 3;
  margin-right: 10px;
`;

const UnidadeInput = styled(Input)`
  flex: 1;
  width: 80px;
  margin-right: 10px;
`;

const RemoveButton = styled(Button)`
  padding: 5px 10px;
  font-size: 12px;
  background-color: #ff0000;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const SuccessMessage = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ZeroHumForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([{ nome: '', quantidade: 1 }]);
  const [apiError, setApiError] = useState(null);

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
    if (unidades.length === 1) {
      // Não remover se é a única unidade
      alert('É necessário informar pelo menos uma unidade.');
      return;
    }

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

  // Validação de formulário com Yup
  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    titulo: Yup.string().required('Título é obrigatório'),
    data_entrega: Yup.date().required('Data de entrega é obrigatória'),
    formato: Yup.string().required('Formato é obrigatório'),
    cor_impressao: Yup.string().required('Cor de impressão é obrigatória'),
    impressao: Yup.string().required('Tipo de impressão é obrigatório'),
  });

  // Configuração do Formik
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
    validationSchema,
    // Versão corrigida do método onSubmit no formulário ZeroHum

onSubmit: async (values) => {
  setLoading(true);
  setApiError(null);
  try {
    // Validar se pelo menos uma unidade tem nome selecionado
    const unidadesValidas = unidades.filter(u => u.nome);
    if (unidadesValidas.length === 0) {
      alert('É necessário informar pelo menos uma unidade com nome selecionado.');
      setLoading(false);
      return;
    }

    // Formatar a data para o formato esperado pelo Django (YYYY-MM-DD)
    const formattedDate = values.data_entrega
      ? new Date(values.data_entrega).toISOString().split('T')[0]
      : '';

    // Preparar os dados das unidades
    const unidadesData = unidadesValidas.map(u => ({
      nome: u.nome,
      quantidade: parseInt(u.quantidade) || 1
    }));

    console.log('Unidades para envio:', unidadesData);

    // Se houver arquivo, usar FormData para enviar tudo junto
    let dataToSend;
    if (arquivo) {
      // *** IMPORTANTE: USE O FORMDATA CORRETAMENTE PARA ARQUIVOS ***
      dataToSend = new FormData();
      
      // Adicionar todos os campos de texto
      dataToSend.append('nome', values.nome);
      dataToSend.append('email', values.email);
      dataToSend.append('titulo', values.titulo);
      dataToSend.append('data_entrega', formattedDate);
      dataToSend.append('observacoes', values.observacoes || '');
      dataToSend.append('formato', values.formato);
      dataToSend.append('cor_impressao', values.cor_impressao);
      dataToSend.append('impressao', values.impressao);
      
      // Adicionar unidades como JSON string
      dataToSend.append('unidades', JSON.stringify(unidadesData));

      // *** ALTERAÇÃO IMPORTANTE: ADICIONE O ARQUIVO COMO ÚLTIMO CAMPO ***
      // E certifique-se de que o nome usado aqui corresponde ao campo no serializer
      dataToSend.append('arquivo', arquivo);

      console.log('FormData criado com os seguintes campos:');
      for (let pair of dataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'arquivo' ? 'Arquivo PDF' : pair[1]}`);
      }
    } else {
      // Envio como JSON se não houver arquivo
      dataToSend = {
        nome: values.nome,
        email: values.email,
        titulo: values.titulo,
        data_entrega: formattedDate,
        observacoes: values.observacoes || '',
        formato: values.formato,
        cor_impressao: values.cor_impressao,
        impressao: values.impressao,
        unidades: unidadesData
      };
      console.log('Enviando JSON:', dataToSend);
    }

    // *** IMPORTANTE: NÃO DEFINA O Content-Type QUANDO ENVIAR FormData ***
    // Deixe o navegador definir o Content-Type automaticamente, incluindo o boundary
    const config = arquivo 
      ? { headers: {} } // Não definir Content-Type para FormData
      : { headers: { 'Content-Type': 'application/json' } }; // Apenas para JSON

    console.log('Enviando requisição...');
    const response = await api.post('/formularios/zerohum/', dataToSend, config);
    
    console.log('Resposta do servidor:', response.data);

    // Se houver link de visualização, mostrar ao usuário
    if (response.data.web_view_link) {
      console.log('Link de visualização do PDF:', response.data.web_view_link);
    }

    // Se houver link de download, disponibilizar ao usuário
    if (response.data.link_download) {
      console.log('Link de download do PDF:', response.data.link_download);
    }

    setSaved(true);
    setTimeout(() => {
      navigate('/forms');
    }, 2000);
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
      setApiError({
        status: error.response.status,
        data: error.response.data
      });
    } else {
      setApiError({
        message: 'Erro de conexão. Tente novamente mais tarde.'
      });
    }
  } finally {
    setLoading(false);
  }
},

  });

  // Handler para o campo de arquivo
  const handleArquivoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  return (
    <MainLayout>
      <FormContainer>
        <Card>
          <CardHeader>
            <CardTitle>Formulário ZeroHum</CardTitle>
          </CardHeader>
          <CardBody>
            {saved && (
              <SuccessMessage>Formulário enviado com sucesso! Redirecionando...</SuccessMessage>
            )}

            {apiError && (
              <div style={{ color: 'red', marginBottom: '20px' }}>
                <h4>Erro ao enviar formulário (Status: {apiError.status || 'Desconhecido'})</h4>
                <pre style={{ background: '#f7f7f7', padding: '10px', overflowX: 'auto' }}>
                  {JSON.stringify(apiError.data || apiError.message, null, 2)}
                </pre>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              {/* Informações básicas */}
              <InputGroup>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nome && formik.errors.nome && (
                  <ErrorMessage>{formik.errors.nome}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Seu e-mail"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <ErrorMessage>{formik.errors.email}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  placeholder="Título do documento"
                  value={formik.values.titulo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.titulo && formik.errors.titulo && (
                  <ErrorMessage>{formik.errors.titulo}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="data_entrega">Data de Entrega</Label>
                <Input
                  id="data_entrega"
                  name="data_entrega"
                  type="date"
                  value={formik.values.data_entrega}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.data_entrega && formik.errors.data_entrega && (
                  <ErrorMessage>{formik.errors.data_entrega}</ErrorMessage>
                )}
              </InputGroup>

              {/* Detalhes do documento */}
              <InputGroup>
                <Label htmlFor="formato">Formato</Label>
                <SelectField
                  id="formato"
                  name="formato"
                  value={formik.values.formato}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="CARTA">Carta</option>
                  <option value="OFICIO">Ofício</option>
                </SelectField>
                {formik.touched.formato && formik.errors.formato && (
                  <ErrorMessage>{formik.errors.formato}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="cor_impressao">Cor da Impressão</Label>
                <SelectField
                  id="cor_impressao"
                  name="cor_impressao"
                  value={formik.values.cor_impressao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="PB">Preto e branco</option>
                  <option value="COLORIDO">Colorido</option>
                </SelectField>
                {formik.touched.cor_impressao && formik.errors.cor_impressao && (
                  <ErrorMessage>{formik.errors.cor_impressao}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="impressao">Tipo de Impressão</Label>
                <SelectField
                  id="impressao"
                  name="impressao"
                  value={formik.values.impressao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="1_LADO">Um lado</option>
                  <option value="2_LADOS">Dois lados</option>
                </SelectField>
                {formik.touched.impressao && formik.errors.impressao && (
                  <ErrorMessage>{formik.errors.impressao}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="observacoes">Observações</Label>
                <TextArea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Observações adicionais"
                  value={formik.values.observacoes}
                  onChange={formik.handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="arquivo">Arquivo PDF</Label>
                <input
                  id="arquivo"
                  name="arquivo"
                  type="file"
                  accept=".pdf"
                  onChange={handleArquivoChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    marginTop: '5px',
                  }}
                />
                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                  Somente arquivos PDF são aceitos
                </small>
              </InputGroup>

              {/* Unidades */}
              <InputGroup>
                <Label>Unidades</Label>
                <UnidadeContainer>
                  {unidades.map((unidade, index) => (
                    <UnidadeItem key={index}>
                      <div style={{ flex: '1', marginBottom: '10px' }}>
                        <Label htmlFor={`unidade-nome-${index}`}>Nome da Unidade</Label>
                        <SelectField
                          id={`unidade-nome-${index}`}
                          value={unidade.nome}
                          onChange={(e) => atualizarUnidade(index, 'nome', e.target.value)}
                        >
                          <option value="">Selecione uma unidade</option>
                          {unidadesDisponiveis.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                              {opcao.label}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                      <div style={{ width: '120px', marginLeft: '10px', marginBottom: '10px' }}>
                        <Label htmlFor={`unidade-qtd-${index}`}>Quantidade</Label>
                        <Input
                          type="number"
                          id={`unidade-qtd-${index}`}
                          min="1"
                          value={unidade.quantidade}
                          onChange={(e) => atualizarUnidade(index, 'quantidade', e.target.value)}
                        />
                      </div>
                      <div style={{ marginLeft: '10px', alignSelf: 'flex-end', marginBottom: '10px' }}>
                        <Button
                          type="button"
                          onClick={() => removerUnidade(index)}
                          variant="danger"
                          size="sm"
                        >
                          Remover
                        </Button>
                      </div>
                    </UnidadeItem>
                  ))}
                </UnidadeContainer>
                <Button
                  type="button"
                  onClick={adicionarUnidade}
                  variant="secondary"
                >
                  + Adicionar Unidade
                </Button>
              </InputGroup>

              <ActionButtons>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/forms')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || saved}
                >
                  {loading ? 'Enviando...' : 'Enviar Formulário'}
                </Button>
              </ActionButtons>
            </form>
          </CardBody>
        </Card>
      </FormContainer>
    </MainLayout>
  );
};

export default ZeroHumForm;
