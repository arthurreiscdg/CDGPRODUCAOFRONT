import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../../services/api';

const formatos = [
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'A3', label: 'A3' },
  { value: 'CARTA', label: 'Carta' },
  { value: 'OFICIO', label: 'Ofício' },
  { value: 'OUTRO', label: 'Outro' },
];
const cores = [
  { value: 'PB', label: 'Preto e Branco' },
  { value: 'COLOR', label: 'Colorido' },
];
const impressoes = [
  { value: '1_LADO', label: 'Um lado' },
  { value: '2_LADOS', label: 'Frente e verso' },
  { value: 'LIVRETO', label: 'Livreto' },
];

const ZeroHumForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    unidade_nome: Yup.string().required('Nome da unidade é obrigatório'),
    unidade_quantidade: Yup.number().positive('Quantidade deve ser positiva').required('Quantidade é obrigatória'),
    titulo: Yup.string().required('Título é obrigatório'),
    data_entrega: Yup.date().required('Data de entrega é obrigatória'),
    observacoes: Yup.string(),
    formato: Yup.string().required('Formato é obrigatório'),
    cor_impressao: Yup.string().required('Cor de impressão é obrigatória'),
    impressao: Yup.string().required('Tipo de impressão é obrigatório'),
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
      impressao: '1_LADO',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });
        if (selectedFile) {
          formData.append('arquivo', selectedFile);
        }
        await api.post('/api/zerohum/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSaved(true);
        setSelectedFile(null);
        setTimeout(() => setSaved(false), 3000);
        formik.resetForm();
      } catch (error) {
        setError(error.response?.data?.message || 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.currentTarget.files[0]);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Formulário ZeroHum</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Nome*</label>
          <input name="nome" value={formik.values.nome} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.nome && formik.errors.nome && <div style={{ color: 'red' }}>{formik.errors.nome}</div>}
        </div>
        <div>
          <label>Email*</label>
          <input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
        </div>
        <div>
          <label>Unidade*</label>
          <input name="unidade_nome" value={formik.values.unidade_nome} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.unidade_nome && formik.errors.unidade_nome && <div style={{ color: 'red' }}>{formik.errors.unidade_nome}</div>}
        </div>
        <div>
          <label>Quantidade*</label>
          <input name="unidade_quantidade" type="number" min="1" value={formik.values.unidade_quantidade} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.unidade_quantidade && formik.errors.unidade_quantidade && <div style={{ color: 'red' }}>{formik.errors.unidade_quantidade}</div>}
        </div>
        <div>
          <label>Título*</label>
          <input name="titulo" value={formik.values.titulo} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.titulo && formik.errors.titulo && <div style={{ color: 'red' }}>{formik.errors.titulo}</div>}
        </div>
        <div>
          <label>Data de Entrega*</label>
          <input name="data_entrega" type="date" value={formik.values.data_entrega} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.data_entrega && formik.errors.data_entrega && <div style={{ color: 'red' }}>{formik.errors.data_entrega}</div>}
        </div>
        <div>
          <label>Observações</label>
          <textarea name="observacoes" value={formik.values.observacoes} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </div>
        <div>
          <label>Formato*</label>
          <select name="formato" value={formik.values.formato} onChange={formik.handleChange} onBlur={formik.handleBlur}>
            {formatos.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {formik.touched.formato && formik.errors.formato && <div style={{ color: 'red' }}>{formik.errors.formato}</div>}
        </div>
        <div>
          <label>Cor de Impressão*</label>
          <select name="cor_impressao" value={formik.values.cor_impressao} onChange={formik.handleChange} onBlur={formik.handleBlur}>
            {cores.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {formik.touched.cor_impressao && formik.errors.cor_impressao && <div style={{ color: 'red' }}>{formik.errors.cor_impressao}</div>}
        </div>
        <div>
          <label>Tipo de Impressão*</label>
          <select name="impressao" value={formik.values.impressao} onChange={formik.handleChange} onBlur={formik.handleBlur}>
            {impressoes.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
          {formik.touched.impressao && formik.errors.impressao && <div style={{ color: 'red' }}>{formik.errors.impressao}</div>}
        </div>
        <div>
          <label>Arquivo PDF</label>
          <input name="arquivo" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
        {saved && <div style={{ color: 'green' }}>Formulário enviado com sucesso!</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default ZeroHumForm;
