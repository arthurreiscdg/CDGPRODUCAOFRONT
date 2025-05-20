import React from 'react';
import Input from '../../../../components/Input';
import { 
  FormSection, 
  SectionTitle,
  Field, 
  Label, 
  Select, 
  UnidadesContainer, 
  UnidadeItem, 
  RemoveButton,
  AddButton
} from '../static/styles/styles';
import { unidadeOptions } from '../static/js/formOptions';

const UnitsSection = ({ 
  unidades, 
  handleUnidadeChange, 
  removeUnidade, 
  addUnidade 
}) => {
  return (
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
  );
};

export default UnitsSection;