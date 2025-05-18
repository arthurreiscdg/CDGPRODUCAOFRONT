import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.5;
  }
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
  }
  
  input, button, textarea, select {
    font-family: inherit;
  }
`;

export default GlobalStyles;
