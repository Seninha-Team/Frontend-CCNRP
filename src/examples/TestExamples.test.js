// Exemplos de diferentes tipos de testes com React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Exemplo de componente simples para demonstração
const Button = ({ onClick, children, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} data-testid="custom-button">
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    data-testid="custom-input"
  />
);

const Counter = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <span data-testid="count-display">{count}</span>
      <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
      <Button onClick={() => setCount(count - 1)}>Decrementar</Button>
    </div>
  );
};

describe('Exemplos de Testes com React Testing Library', () => {
  
  describe('1. Testes de Renderização', () => {
    test('renderiza um botão com texto', () => {
      render(<Button>Clique aqui</Button>);
      
      const button = screen.getByRole('button', { name: /clique aqui/i });
      expect(button).toBeInTheDocument();
    });

    test('renderiza um input com placeholder', () => {
      render(<Input placeholder="Digite algo" />);
      
      const input = screen.getByPlaceholderText('Digite algo');
      expect(input).toBeInTheDocument();
    });

    test('renderiza elemento por testId', () => {
      render(<Button>Teste</Button>);
      
      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('2. Testes de Interação com fireEvent', () => {
    test('chama função onClick quando botão é clicado', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clique</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('atualiza valor do input quando digitado', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByTestId('custom-input');
      fireEvent.change(input, { target: { value: 'novo valor' } });
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'novo valor' })
        })
      );
    });
  });

  describe('3. Testes de Interação com userEvent', () => {
    test('digita texto no input usando userEvent', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByTestId('custom-input');
      await user.type(input, 'texto digitado');
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('clica em botão usando userEvent', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clique</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('4. Testes de Estado e Hooks', () => {
    test('incrementa contador quando botão é clicado', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      
      const countDisplay = screen.getByTestId('count-display');
      const incrementButton = screen.getByRole('button', { name: /incrementar/i });
      
      expect(countDisplay).toHaveTextContent('0');
      
      await user.click(incrementButton);
      expect(countDisplay).toHaveTextContent('1');
      
      await user.click(incrementButton);
      expect(countDisplay).toHaveTextContent('2');
    });

    test('decrementa contador quando botão é clicado', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      
      const countDisplay = screen.getByTestId('count-display');
      const incrementButton = screen.getByRole('button', { name: /incrementar/i });
      const decrementButton = screen.getByRole('button', { name: /decrementar/i });
      
      // Incrementa primeiro
      await user.click(incrementButton);
      await user.click(incrementButton);
      expect(countDisplay).toHaveTextContent('2');
      
      // Depois decrementa
      await user.click(decrementButton);
      expect(countDisplay).toHaveTextContent('1');
    });
  });

  describe('5. Testes de Atributos e Propriedades', () => {
    test('botão está desabilitado quando prop disabled é true', () => {
      render(<Button disabled>Botão Desabilitado</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('input tem tipo correto', () => {
      render(<Input type="email" />);
      
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('6. Testes de Queries Avançadas', () => {
    test('encontra elemento por texto parcial', () => {
      render(<Button>Botão de Teste</Button>);
      
      const button = screen.getByText(/teste/i);
      expect(button).toBeInTheDocument();
    });

    test('encontra elemento por role', () => {
      render(<Button>Botão</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('verifica se elemento não existe', () => {
      render(<div>Conteúdo</div>);
      
      const elementoInexistente = screen.queryByText('Texto que não existe');
      expect(elementoInexistente).not.toBeInTheDocument();
    });
  });

  describe('7. Testes de waitFor', () => {
    test('aguarda elemento aparecer', async () => {
      const AsyncComponent = () => {
        const [show, setShow] = React.useState(false);
        
        React.useEffect(() => {
          const timer = setTimeout(() => setShow(true), 100);
          return () => clearTimeout(timer);
        }, []);
        
        return show ? <div data-testid="async-element">Elemento carregado!</div> : null;
      };
      
      render(<AsyncComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('async-element')).toBeInTheDocument();
      });
    });
  });

  describe('8. Testes de Múltiplos Elementos', () => {
    test('encontra múltiplos botões', () => {
      render(
        <div>
          <Button>Botão 1</Button>
          <Button>Botão 2</Button>
          <Button>Botão 3</Button>
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      expect(buttons[0]).toHaveTextContent('Botão 1');
      expect(buttons[1]).toHaveTextContent('Botão 2');
      expect(buttons[2]).toHaveTextContent('Botão 3');
    });
  });
});

