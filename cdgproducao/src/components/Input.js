import React, { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label`
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.dark};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid #ced4da;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: #e9ecef;
    opacity: 1;
  }
  
  &::placeholder {
    color: #6c757d;
    opacity: 1;
  }
  
  ${({ error }) => error && `
    border-color: #dc3545;
    
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  `}
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: 0.25rem;
`;

const Input = forwardRef(({
  label,
  error,
  fullWidth = false,
  ...props
}, ref) => (
  <InputContainer fullWidth={fullWidth}>
    {label && <InputLabel htmlFor={props.id}>{label}</InputLabel>}
    <StyledInput ref={ref} error={!!error} {...props} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </InputContainer>
));

Input.displayName = 'Input';

export default Input;
