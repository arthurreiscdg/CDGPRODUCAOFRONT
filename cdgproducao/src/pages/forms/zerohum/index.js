import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

// Componentes
import { Button } from '../../../components/Button';
import Input from '../../../components/Input';

// Estilos
const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 1rem;
`;

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Field = styled.div`
  flex: ${({ size }) => size || 1};
  min-width: ${({ minWidth }) => minWidth || '200px'};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 100px;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem;
`;

const UnidadesContainer = styled.div`
  margin-bottom: 1rem;
`;

const UnidadeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
`;

const AddButton = styled(Button)`
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #e8f8f5;
  border-radius: 4px;
`;

const ZeroHumForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    nome: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    email: user?.email || '',
    titulo: '',
    data_entrega: '',
    observacoes: '',
    formato: 'A4',
    cor_impressao: 'PB',
    impressao: '1_LADO',
  });

  // Estados para unidades
  const [unidades, setUnidades] = useState([
    { nome: 'ARARUAMA', quantidade: 1 }
  ]);

  // Estado para o arquivo
  const [arquivo, setArquivo] = useState(null);
  
  // Estados para feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Opções para os selects
  const formatoOptions = [
    { value: 'A4', label: 'A4' },
    { value: 'A5', label: 'A5' },
    { value: 'A3', label: 'A3' },
    { value: 'CARTA', label: 'Carta' },
    { value: 'OFICIO', label: 'Ofício' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  const corImpressaoOptions = [
    { value: 'PB', label: 'Preto e Branco' },
    { value: 'COLOR', label: 'Colorido' },
  ];

  const impressaoOptions = [
    { value: '1_LADO', label: 'Um lado' },
    { value: '2_LADOS', label: 'Frente e verso' },
    { value: 'LIVRETO', label: 'Livreto' },
  ];

  const unidadeOptions = [
    { value: 'ARARUAMA', label: 'Araruama' },
    { value: 'CABO_FRIO', label: 'Cabo Frio' },
    { value: 'ITABORAI', label: 'Itaboraí' },
    { value: 'ITAIPUACU', label: 'Itaipuaçu' },
    { value: 'MARICA_I', label: 'Maricá I' },
    { value: 'NOVA_FRIBURGO', label: 'Nova Friburgo' },
    { value: 'QUEIMADOS', label: 'Queimados' },
    { value: 'SEROPEDICA', label: 'Seropédica' },
    { value: 'ALCANTARA', label: 'Alcântara' },
    { value: 'BANGU', label: 'Bangu' },
    { value: 'BARRA_DA_TIJUCA', label: 'Barra da Tijuca' },
    { value: 'BELFORD_ROXO', label: 'Belford Roxo' },
    { value: 'DUQUE_DE_CAXIAS', label: 'Duque de Caxias' },
    { value: 'ICARAI', label: 'Icaraí' },
    { value: 'ILHA_DO_GOVERNADOR', label: 'Ilha do Governador' },
    { value: 'ITAIPU', label: 'Itaipu' },
    { value: 'MADUREIRA', label: 'Madureira' },
    { value: 'MEIER', label: 'Méier' },
    { value: 'NILOPOLIS', label: 'Nilópolis' },
    { value: 'NITEROI', label: 'Niterói' },
    { value: 'NOVA_IGUACU', label: 'Nova Iguaçu' },
    { value: 'OLARIA', label: 'Olaria' },
    { value: 'PRATA', label: 'Prata' },
    { value: 'SAO_GONCALO', label: 'São Gonçalo' },
    { value: 'SAO_JOAO_DE_MERITI', label: 'São João de Meriti' },
    { value: 'VILA_ISABEL', label: 'Vila Isabel' },
    { value: 'VILAR_DOS_TELES', label: 'Vilar dos Teles' },
  ];

  // Handlers para mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler para mudança no arquivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  // Handlers para unidades
  const handleUnidadeChange = (index, field, value) => {
    const updatedUnidades = [...unidades];
    updatedUnidades[index] = { ...updatedUnidades[index], [field]: value };
    setUnidades(updatedUnidades);
  };

  const addUnidade = () => {
    setUnidades([...unidades, { nome: 'ARARUAMA', quantidade: 1 }]);
  };

  const removeUnidade = (index) => {
    if (unidades.length > 1) {
      const updatedUnidades = unidades.filter((_, i) => i !== index);
      setUnidades(updatedUnidades);
    } else {
      setError('É necessário pelo menos uma unidade');
    }
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação
    if (!formData.nome || !formData.email || !formData.titulo || !formData.data_entrega) {
      setError('Por favor, preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (!arquivo) {
      setError('Por favor, selecione um arquivo PDF');
      setLoading(false);
      return;
    }

    // Criar FormData para envio
    const formDataSubmit = new FormData();
    
    // Adicionar campos do formulário
    Object.entries(formData).forEach(([key, value]) => {
      formDataSubmit.append(key, value);
    });

    // Adicionar arquivo
    formDataSubmit.append('arquivo', arquivo);

    // Adicionar unidades
    formDataSubmit.append('unidades', JSON.stringify(unidades));

    try {
      // Enviar para a API
      const response = await api.post('/formularios/zerohum/', formDataSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(`Formulário enviado com sucesso! Código de operação: ${response.data.cod_op}`);
      
      // Resetar formulário após envio bem-sucedido
      setFormData({
        ...formData,
        titulo: '',
        data_entrega: '',
        observacoes: '',
      });
      setArquivo(null);
      
      // Resetar o input de arquivo
      const fileInput = document.getElementById('arquivo-input');
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Formulário ZeroHum</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Informações de Contato</SectionTitle>
          <FieldRow>
            <Field size={2}>
              <Input
                label="Nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
                fullWidth
              />
            </Field>
            <Field size={2}>
              <Input
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                required
                fullWidth
              />
            </Field>
          </FieldRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Informações do Documento</SectionTitle>
          <FieldRow>
            <Field size={2}>
              <Input
                label="Título do Documento"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Apostila de Matemática - 9º Ano"
                required
                fullWidth
              />
            </Field>
            <Field>
              <Input
                label="Data de Entrega"
                name="data_entrega"
                type="date"
                value={formData.data_entrega}
                onChange={handleChange}
                required
                fullWidth
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <Label>Formato</Label>
              <Select name="formato" value={formData.formato} onChange={handleChange}>
                {formatoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Cor de Impressão</Label>
              <Select name="cor_impressao" value={formData.cor_impressao} onChange={handleChange}>
                {corImpressaoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Tipo de Impressão</Label>
              <Select name="impressao" value={formData.impressao} onChange={handleChange}>
                {impressaoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field size={3}>
              <Label>Observações</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Adicione observações ou instruções especiais aqui..."
              />
            </Field>
          </FieldRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Arquivo PDF</SectionTitle>
          <FieldRow>
            <Field size={3}>
              <Label>Selecione o arquivo PDF</Label>
              <FileInput
                id="arquivo-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {arquivo && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Arquivo selecionado: {arquivo.name}
                </div>
              )}
            </Field>
          </FieldRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Distribuição por Unidades</SectionTitle>
          <UnidadesContainer>
            {unidades.map((unidade, index) => (
              <UnidadeItem key={index}>
                <Field size={2}>
                  <Label>Unidade</Label>
                  <Select
                    value={unidade.nome}
                    onChange={(e) => handleUnidadeChange(index, 'nome', e.target.value)}
                  >
                    {unidadeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={unidade.quantidade}
                    onChange={(e) => handleUnidadeChange(index, 'quantidade', parseInt(e.target.value) || 1)}
                    fullWidth
                  />
                </Field>
                <div>
                  <RemoveButton 
                    type="button" 
                    onClick={() => removeUnidade(index)}
                    title="Remover unidade"
                  >
                    X
                  </RemoveButton>
                </div>
              </UnidadeItem>
            ))}
          </UnidadesContainer>
          <AddButton type="button" onClick={addUnidade} variant="outlined">
            Adicionar Unidade
          </AddButton>
        </FormSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonContainer>
          <Button type="button" variant="outlined" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Formulário'}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ZeroHumForm;