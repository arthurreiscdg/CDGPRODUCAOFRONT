import React from 'react';
import { 
  FormSection, 
  SectionTitle, 
  FieldRow, 
  Field, 
  Label, 
  FileInput,
  RemoveButton
} from '../static/styles/styles';

const FileSection = ({ arquivos, handleFileChange, handleRemoveFile }) => {
  return (
    <FormSection>
      <SectionTitle>Arquivos PDF</SectionTitle>
      <FieldRow>
        <Field size={3}>
          <Label>Selecione os arquivos PDF</Label>
          <FileInput
            id="arquivo-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required={arquivos.length === 0}
            multiple
          />
          {arquivos.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Arquivos selecionados:</p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {arquivos.map((arquivo, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center', 
                    marginBottom: '0.25rem', 
                    fontSize: '0.875rem',
                    padding: '0.25rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                  }}>
                    <span title={arquivo.name} style={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '80%'
                    }}>
                      {arquivo.name}
                    </span>
                    <RemoveButton 
                      type="button" 
                      onClick={() => handleRemoveFile(index)}
                      title="Remover arquivo"
                      style={{ padding: '2px 6px' }}
                    >
                      X
                    </RemoveButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Field>
      </FieldRow>
    </FormSection>
  );
};

export default FileSection;