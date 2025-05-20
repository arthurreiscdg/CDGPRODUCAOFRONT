import React from 'react';
import Input from '../../../../components/Input';
import { 
  FormSection, 
  SectionTitle, 
  FieldRow, 
  Field, 
  Label, 
  Select, 
  TextArea 
} from '../static/styles/styles';
import { 
  formatoOptions, 
  corImpressaoOptions, 
  impressaoOptions 
} from '../static/js/formOptions';

const DocumentSection = ({ formData, handleChange }) => {
  return (
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
        <Field>
          <Input
            label="Gramatura do Papel"
            name="gramatura"
            type="text"
            value={formData.gramatura}
            onChange={handleChange}
            placeholder="Ex: 75g, 90g"
            fullWidth
          />
        </Field>
        <Field>
          <Input
            label="Grampos"
            name="grampos"
            type="text"
            value={formData.grampos}
            onChange={handleChange}
            placeholder="Ex: 2, 3, canoa"
            fullWidth
          />
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
  );
};

export default DocumentSection;