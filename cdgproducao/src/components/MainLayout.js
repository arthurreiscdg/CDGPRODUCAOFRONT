import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;

const NavItem = styled.li`
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
    
    &.active {
      font-weight: bold;
      text-decoration: underline;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-left: 0.5rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Footer = styled.footer`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const MainLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Header>
        <Logo>CDG Produção</Logo>
        <Navigation>
          <NavList>
            <NavItem>
              <Link to="/">Home</Link>
            </NavItem>
            <NavItem>
              <Link to="/webhooks">Webhooks</Link>
            </NavItem>
            <NavItem>
              <Link to="/forms">Formulários</Link>
            </NavItem>
          </NavList>
        </Navigation>
        <UserMenu>
          <UserInfo>
            <UserName>{user?.name || 'Usuário'}</UserName>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </UserMenu>
      </Header>
      <Main>{children}</Main>
      <Footer>CDG Produção &copy; {new Date().getFullYear()}</Footer>
    </LayoutContainer>
  );
};

export default MainLayout;
