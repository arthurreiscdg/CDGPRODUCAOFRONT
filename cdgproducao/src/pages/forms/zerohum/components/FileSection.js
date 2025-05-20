import React from 'react';
import { 
  FormSection, 
  SectionTitle, 
  FieldRow, 
  Field, 
  Label, 
  FileInput 
} from '../static/styles/styles';

const FileSection = ({ handleFileChange, arquivo }) => {
  return (
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
  );
};

export default FileSection;