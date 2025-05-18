import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../../components/MainLayout';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/Card';
import api from '../../services/api';

const StyledHome = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DashboardCard = styled(Card)`
  height: 100%;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 1rem 0;
`;

const MetricLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme, color }) => theme.colors[color] || theme.colors.primary}20;
  color: ${({ theme, color }) => theme.colors[color] || theme.colors.primary};
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
`;

const RecentActivity = styled(Card)`
  margin-top: 2rem;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0.25rem;
`;

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    totalWebhooks: 0,
    activeWebhooks: 0,
    totalForms: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Em um ambiente real, você buscaria dados da API
        // const response = await api.get('/dashboard');
        // setDashboardData(response.data);
        
        // Simulando dados para exemplo
        setTimeout(() => {
          setDashboardData({
            totalWebhooks: 24,
            activeWebhooks: 18,
            totalForms: 12,
            recentActivities: [
              { id: 1, type: 'webhook', action: 'Webhook criado', name: 'Novo pedido', date: '2025-05-18T10:30:00' },
              { id: 2, type: 'form', action: 'Formulário atualizado', name: 'Cadastro de cliente', date: '2025-05-17T15:45:00' },
              { id: 3, type: 'webhook', action: 'Webhook acionado', name: 'Pagamento confirmado', date: '2025-05-17T09:15:00' },
              { id: 4, type: 'form', action: 'Formulário enviado', name: 'Pesquisa de satisfação', date: '2025-05-16T14:20:00' },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div>Carregando...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <WelcomeCard>
        <WelcomeTitle>Bem-vindo ao Painel de Controle</WelcomeTitle>
        <WelcomeText>
          Aqui você pode gerenciar seus webhooks e formulários. Utilize o menu superior para navegação.
        </WelcomeText>
      </WelcomeCard>

      <StyledHome>
        <DashboardCard>
          <CardHeader>
            <CardTitle>Total de Webhooks</CardTitle>
            <CardIcon color="primary">📡</CardIcon>
          </CardHeader>
          <CardBody>
            <MetricValue>{dashboardData.totalWebhooks}</MetricValue>
            <MetricLabel>Webhooks configurados</MetricLabel>
          </CardBody>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardTitle>Webhooks Ativos</CardTitle>
            <CardIcon color="success">✓</CardIcon>
          </CardHeader>
          <CardBody>
            <MetricValue>{dashboardData.activeWebhooks}</MetricValue>
            <MetricLabel>Em funcionamento</MetricLabel>
          </CardBody>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardTitle>Formulários</CardTitle>
            <CardIcon color="info">📝</CardIcon>
          </CardHeader>
          <CardBody>
            <MetricValue>{dashboardData.totalForms}</MetricValue>
            <MetricLabel>Formulários criados</MetricLabel>
          </CardBody>
        </DashboardCard>
      </StyledHome>

      <RecentActivity>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardBody>
          <ActivityList>
            {dashboardData.recentActivities.map((activity) => (
              <ActivityItem key={activity.id}>
                <div><strong>{activity.action}</strong>: {activity.name}</div>
                <ActivityDate>{formatDate(activity.date)}</ActivityDate>
              </ActivityItem>
            ))}
          </ActivityList>
        </CardBody>
      </RecentActivity>
    </MainLayout>
  );
};

export default Home;
