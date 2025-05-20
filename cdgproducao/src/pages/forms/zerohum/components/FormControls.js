import React from 'react';
import { Button } from '../../../../components/Button';
import { 
  ButtonContainer, 
  ErrorMessage, 
  SuccessMessage 
} from '../static/styles/styles';

const FormControls = ({ 
  navigate, 
  error, 
  success, 
  loading 
}) => {
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ButtonContainer>
        <Button type="button" variant="outlined" onClick={() => navigate('/')}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Formulário'}
        </Button>
      </ButtonContainer>
    </>
  );
};

export default FormControls;