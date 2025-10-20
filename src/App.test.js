import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';
import '@testing-library/jest-dom';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios;

// Mock do window.alert
global.alert = jest.fn();

// Mock do window.prompt
global.prompt = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    // Mock da resposta da API
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, nome: 'Pneu', quantidade: 4 },
        { id: 2, nome: 'Óleo', quantidade: 2 }
      ]
    });
  });

  test('renderiza o título da aplicação', () => {
    render(<App />);
    const titleElement = screen.getByText('Controle de Peças de Carro');
    expect(titleElement).toBeInTheDocument();
  });

  test('renderiza os campos de input e botão adicionar', () => {
    render(<App />);
    
    const nomeInput = screen.getByPlaceholderText('Nome da peça');
    const quantidadeInput = screen.getByPlaceholderText('Quantidade');
    const addButton = screen.getByText('Adicionar');
    
    expect(nomeInput).toBeInTheDocument();
    expect(quantidadeInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('carrega e exibe a lista de peças da API', async () => {
    render(<App />);
    
    // Aguarda a lista ser carregada
    await waitFor(() => {
      expect(screen.getByText('Pneu')).toBeInTheDocument();
      expect(screen.getByText('Óleo')).toBeInTheDocument();
    });
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/pecas');
  });

  test('permite adicionar uma nova peça', async () => {
    const user = userEvent.setup();
    
    // Mock da resposta do POST
    mockedAxios.post.mockResolvedValue({
      data: { id: 3, nome: 'Filtro de Ar', quantidade: 1 }
    });
    
    render(<App />);
    
    // Aguarda a lista inicial carregar
    await waitFor(() => {
      expect(screen.getByText('Pneu')).toBeInTheDocument();
    });
    
    // Preenche os campos
    const nomeInput = screen.getByPlaceholderText('Nome da peça');
    const quantidadeInput = screen.getByPlaceholderText('Quantidade');
    
    await user.type(nomeInput, 'Filtro de Ar');
    await user.type(quantidadeInput, '1');
    
    // Clica no botão adicionar
    const addButton = screen.getByText('Adicionar');
    await user.click(addButton);
    
    // Verifica se a API foi chamada
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3001/pecas', {
      nome: 'Filtro de Ar',
      quantidade: 1
    });
    
    // Verifica se a nova peça foi adicionada à lista
    await waitFor(() => {
      expect(screen.getByText('Filtro de Ar')).toBeInTheDocument();
    });
    
    // Verifica se os campos foram limpos
    expect(nomeInput.value).toBe('');
    expect(quantidadeInput.value).toBe('');
  });

  test('exibe alerta quando tenta adicionar peça sem preencher campos', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    const addButton = screen.getByText('Adicionar');
    await user.click(addButton);
    
    expect(global.alert).toHaveBeenCalledWith('Preencha o nome da peça e a quantidade!');
  });

  test('permite deletar uma peça', async () => {
    const user = userEvent.setup();
    
    // Mock da resposta do DELETE
    mockedAxios.delete.mockResolvedValue({});
    
    render(<App />);
    
    // Aguarda a lista carregar
    await waitFor(() => {
      expect(screen.getByText('Pneu')).toBeInTheDocument();
    });
    
    // Encontra e clica no botão deletar da primeira peça
    const deleteButtons = screen.getAllByText('Deletar');
    await user.click(deleteButtons[0]);
    
    // Verifica se a API foi chamada
    expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3001/pecas/1');
    
    // Verifica se a peça foi removida da lista
    await waitFor(() => {
      expect(screen.queryByText('Pneu')).not.toBeInTheDocument();
    });
  });

  test('permite editar uma peça', async () => {
    const user = userEvent.setup();
    
    // Mock do prompt
    global.prompt
      .mockReturnValueOnce('Pneu Novo') // novo nome
      .mockReturnValueOnce('6'); // nova quantidade
    
    // Mock da resposta do PUT
    mockedAxios.put.mockResolvedValue({
      data: { id: 1, nome: 'Pneu Novo', quantidade: 6 }
    });
    
    render(<App />);
    
    // Aguarda a lista carregar
    await waitFor(() => {
      expect(screen.getByText('Pneu')).toBeInTheDocument();
    });
    
    // Encontra e clica no botão editar da primeira peça
    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);
    
    // Verifica se o prompt foi chamado
    expect(global.prompt).toHaveBeenCalledWith('Novo nome da peça:', 'Pneu');
    expect(global.prompt).toHaveBeenCalledWith('Nova quantidade:', 4);
    
    // Verifica se a API foi chamada
    expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3001/pecas/1', {
      nome: 'Pneu Novo',
      quantidade: 6
    });
    
    // Verifica se a peça foi atualizada na lista
    await waitFor(() => {
      expect(screen.getByText('Pneu Novo')).toBeInTheDocument();
      expect(screen.getByText('Quantidade: 6')).toBeInTheDocument();
    });
  });

  test('lida com erros da API', async () => {
    // Mock de erro na API
    mockedAxios.get.mockRejectedValue(new Error('Erro na API'));
    
    // Mock do console.log para capturar o erro
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<App />);
    
    // Aguarda um pouco para o erro ser processado
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});

test('renders header with CCNRP text', () => {
  render(<App />);
  const title = screen.getByText(/CCNRP/i);
  expect(title).toBeInTheDocument();
});