import styled from 'styled-components';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme, padding }) => padding || theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  ${({ withBorder, theme }) => withBorder && `
    border: 1px solid ${theme.colors.light};
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
`;

export const CardBody = styled.div`
  padding: ${({ padding }) => padding || '0'};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.light};
`;

export default Card;
