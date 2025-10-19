// Utilitários de teste personalizados
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Função para renderizar componentes com providers necessários
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Função customizada de render que inclui providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar tudo
export * from '@testing-library/react';

// Sobrescrever o render padrão
export { customRender as render };

// Utilitários adicionais para testes
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@exemplo.com',
  ...overrides
});

export const createMockPeca = (overrides = {}) => ({
  id: 1,
  nome: 'Peça Teste',
  quantidade: 1,
  ...overrides
});

// Função para aguardar elementos aparecerem
export const waitForElement = async (getByTestId, testId, timeout = 1000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      return getByTestId(testId);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Elemento com testId "${testId}" não encontrado em ${timeout}ms`);
};

