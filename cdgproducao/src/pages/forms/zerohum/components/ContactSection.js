import React from 'react';
import Input from '../../../../components/Input';
import { FormSection, SectionTitle, FieldRow, Field } from '../static/styles/styles';

const ContactSection = ({ formData, handleChange }) => {
  return (
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
  );
};

export default ContactSection;