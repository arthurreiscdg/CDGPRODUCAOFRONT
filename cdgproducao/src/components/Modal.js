import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '400px';
      case 'large':
        return '800px';
      case 'xlarge':
        return '1200px';
      default:
        return '600px';
    }
  }};
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.dark};
  
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const Body = styled.div``;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.light};
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium'
}) => {
  if (!isOpen) return null;
  
  return (
    <Container isOpen={isOpen} onClick={onClose}>
      <Content 
        size={size}
        onClick={(e) => e.stopPropagation()} 
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Content>
    </Container>
  );
};

export default Modal;
