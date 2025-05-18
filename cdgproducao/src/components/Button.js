import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme, variant }) => 
    variant === 'outlined' ? theme.colors.primary : theme.colors.white};
  background-color: ${({ theme, variant }) => 
    variant === 'outlined' ? 'transparent' : theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, variant }) => 
      variant === 'outlined' ? 'rgba(0, 123, 255, 0.1)' : '#0069d9'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.2rem;
        `;
      case 'large':
        return `
          padding: 0.75rem 2rem;
          font-size: 1.25rem;
          border-radius: 0.3rem;
        `;
      default:
        return '';
    }
  }}
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  border-radius: 50%;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 0.25rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return `
          padding: 0.75rem;
          font-size: 1.25rem;
        `;
      default:
        return '';
    }
  }}
`;

export default Button;
