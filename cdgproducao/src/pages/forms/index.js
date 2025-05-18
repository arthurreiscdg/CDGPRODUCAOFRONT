import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/Card';
import Button from '../../components/Button';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
`;

const FormCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    cursor: pointer;
  }
`;

const FormCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FormTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const FormDescription = styled.p`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.secondary};
  flex-grow: 1;
`;

const FormIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.color || props.theme.colors.primary};
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const FormsList = () => {
  const navigate = useNavigate();

  const predefinedForms = [
    { 
      id: 'zerohum', 
      name: 'ZeroUm', 
      description: 'Formulário de coleta de dados para ZeroUm',
      logo: '📚',
      color: '#3498db'
    },
    { 
      id: 'elite', 
      name: 'Elite', 
      description: 'Formulário de coleta de dados para Elite',
      logo: '🎓',
      color: '#e74c3c'
    },
    { 
      id: 'coleguium', 
      name: 'Coleguium', 
      description: 'Formulário de coleta de dados para Coleguium',
      logo: '🏫',
      color: '#2ecc71'
    },
    { 
      id: 'pensi', 
      name: 'Pensi', 
      description: 'Formulário de coleta de dados para Pensi',
      logo: '✏️',
      color: '#f39c12'
    }
  ];

  const handleNavigateToForm = (formId) => {
    navigate(`/forms/${formId}`);
  };

  const handleViewSubmissions = (formId) => {
    navigate(`/forms/${formId}/submissions`);
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Gerenciamento de Formulários</PageTitle>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Formulários Disponíveis</CardTitle>
        </CardHeader>
        <CardBody>
          <FormCardsContainer>
            {predefinedForms.map((form) => (
              <FormCard key={form.id} onClick={() => handleNavigateToForm(form.id)}>
                <FormCardBody>
                  <FormIcon color={form.color}>{form.logo}</FormIcon>
                  <FormTitle>{form.name}</FormTitle>
                  <FormDescription>{form.description}</FormDescription>
                  <ButtonsContainer>
                    <Button size="small" onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToForm(form.id);
                    }}>
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSubmissions(form.id);
                      }}
                    >
                      Ver Respostas
                    </Button>
                  </ButtonsContainer>
                </FormCardBody>
              </FormCard>
            ))}
          </FormCardsContainer>
        </CardBody>
      </Card>
    </MainLayout>
  );
};

export default FormsList;
