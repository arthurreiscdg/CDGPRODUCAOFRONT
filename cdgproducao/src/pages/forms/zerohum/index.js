import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

// Componentes
import ContactSection from './components/ContactSection';
import DocumentSection from './components/DocumentSection';
import FileSection from './components/FileSection';
import UnitsSection from './components/UnitsSection';
import FormControls from './components/FormControls';

// Estilos
import { FormContainer, FormTitle } from './static/styles/styles';

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
    gramatura: '75g',
    grampos: '',
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
        gramatura: '75g',
        grampos: '',
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
        <ContactSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <DocumentSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <FileSection 
          handleFileChange={handleFileChange} 
          arquivo={arquivo} 
        />
        
        <UnitsSection 
          unidades={unidades}
          handleUnidadeChange={handleUnidadeChange}
          removeUnidade={removeUnidade}
          addUnidade={addUnidade}
        />
        
        <FormControls 
          navigate={navigate}
          error={error}
          success={success}
          loading={loading}
        />
      </form>
    </FormContainer>
  );
};

export default ZeroHumForm;