/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * 
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda brasileira
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data em formato ISO para o formato brasileiro
 * 
 * @param {string} dateString - Data em formato ISO
 * @returns {string} - Data formatada em formato brasileiro
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR");
};

/**
 * Formata um número de documento (CPF/CNPJ)
 * 
 * @param {string} doc - Número do documento
 * @returns {string} - Documento formatado
 */
export const formatDocument = (doc) => {
  if (!doc) return "-";
  
  // Remove caracteres não numéricos
  const numbers = doc.replace(/\D/g, "");
  
  // Verifica se é CPF (11 dígitos)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  
  // Verifica se é CNPJ (14 dígitos)
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  
  // Se não for nem CPF nem CNPJ, retorna como está
  return doc;
};

/**
 * Trunca um texto longo adicionando "..." ao final
 * 
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo do texto
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "-";
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + "...";
};
