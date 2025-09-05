import { render } from '@testing-library/react';
import { screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import Swal from 'sweetalert2';

import SelectedClients from '~/pages/SelectedClients';
import { useClients } from '~/hooks/Clients';
import Toast from '~/utils/toast';

// --- Mocks Globais ---

// 1. Mock do hook useClients
// Criamos funções espiãs para poder verificar se elas são chamadas.
const mockRemoveSelectecClient = vi.fn();
const mockRemoveAllSelectecClients = vi.fn();
const mockedUseClients = vi.mocked(useClients);

vi.mock('~/hooks/Clients', () => ({
  useClients: vi.fn(() => ({
    clients: [],
    removeSelectecClient: mockRemoveSelectecClient,
    removeAllSelectecClients: mockRemoveAllSelectecClients,
  })),
}));

// 2. Mock do Toast e Swal
vi.mock('~/utils/toast', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// O mock do Swal precisa ser um pouco mais avançado para simular a resposta da Promise.
const mockedSwal = vi.mocked(Swal);
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// --- Dados de Teste ---
const mockClients = [
  { id: 1, name: 'João da Silva', salary: 5000, companyValuation: 100000 },
  { id: 2, name: 'Maria Oliveira', salary: 7500, companyValuation: 250000 },
];

describe('Página de Clientes Selecionados', () => {
  beforeEach(() => {
    // Limpa todos os mocks e reseta as implementações antes de cada teste.
    vi.clearAllMocks();
    mockedUseClients.mockReturnValue({
      clients: [],
      removeSelectecClient: mockRemoveSelectecClient,
      removeAllSelectecClients: mockRemoveAllSelectecClients,
    } as any);
  });

  it('deve exibir uma mensagem quando nenhum cliente for selecionado', () => {
    render(<SelectedClients />);
    expect(
      screen.getByText('Nenhum cliente selecionado ainda')
    ).toBeInTheDocument();
    // O botão de limpar não deve aparecer
    expect(
      screen.queryByRole('button', { name: /limpar clientes selecionados/i })
    ).not.toBeInTheDocument();
  });

  it('deve listar os clientes selecionados e o botão de limpar', () => {
    // Configura o retorno do hook para este teste específico
    mockedUseClients.mockReturnValue({
      clients: mockClients,
      removeSelectecClient: mockRemoveSelectecClient,
      removeAllSelectecClients: mockRemoveAllSelectecClients,
    } as any);

    render(<SelectedClients />);

    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /limpar clientes selecionados/i })
    ).toBeInTheDocument();
  });

  it('deve chamar removeSelectecClient quando o usuário confirmar a desseleção', async () => {
    const user = userEvent.setup();
    // Simula o Swal retornando que o usuário clicou em "Sim"
    mockedSwal.fire.mockResolvedValue({ isConfirmed: true } as any);
    mockedUseClients.mockReturnValue({
      clients: mockClients,
      removeSelectecClient: mockRemoveSelectecClient,
      removeAllSelectecClients: mockRemoveAllSelectecClients,
    } as any);

    render(<SelectedClients />);

    // Para selecionar o botão de forma única, vamos buscar pelo card do cliente primeiro
    const joaoCard = screen.getByText('João da Silva').closest('.ClientBox');
    const unselectButton = joaoCard?.querySelector('.btn-unselect');

    expect(unselectButton).toBeInTheDocument();
    if (unselectButton) {
      await user.click(unselectButton);
    }

    await waitFor(() => {
      // Verifica se o Swal foi chamado com o título correto
      expect(mockedSwal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Gostaria de desselecionar João da Silva?',
        })
      );
      // Verifica se a função para remover foi chamada com o ID correto
      expect(mockRemoveSelectecClient).toHaveBeenCalledWith(1);
      // Verifica se o toast de sucesso apareceu
      expect(Toast.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cliente desselecionado com sucesso',
        })
      );
    });
  });

  it('deve chamar removeAllSelectecClients quando o usuário confirmar para limpar todos', async () => {
    const user = userEvent.setup();
    mockedSwal.fire.mockResolvedValue({ isConfirmed: true } as any);
    mockedUseClients.mockReturnValue({
      clients: mockClients,
      removeSelectecClient: mockRemoveSelectecClient,
      removeAllSelectecClients: mockRemoveAllSelectecClients,
    } as any);

    render(<SelectedClients />);

    const cleanButton = screen.getByRole('button', {
      name: /limpar clientes selecionados/i,
    });
    await user.click(cleanButton);

    await waitFor(() => {
      expect(mockedSwal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Gostaria de limpar todos os clientes selecionados?',
        })
      );
      expect(mockRemoveAllSelectecClients).toHaveBeenCalled();
      expect(Toast.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Todos os clientes foram desselecionados com sucesso',
        })
      );
    });
  });

  it('NÃO deve remover o cliente se o usuário cancelar a desseleção', async () => {
    const user = userEvent.setup();
    // Simula o Swal retornando que o usuário clicou em "Não"
    mockedSwal.fire.mockResolvedValue({ isConfirmed: false } as any);
    mockedUseClients.mockReturnValue({
      clients: mockClients,
      removeSelectecClient: mockRemoveSelectecClient,
      removeAllSelectecClients: mockRemoveAllSelectecClients,
    } as any);

    render(<SelectedClients />);

    const joaoCard = screen.getByText('João da Silva').closest('.ClientBox');
    const unselectButton = joaoCard?.querySelector('.btn-unselect');

    if (unselectButton) {
      await user.click(unselectButton);
    }

    await waitFor(() => {
      expect(mockedSwal.fire).toHaveBeenCalled();
    });

    // Garante que as funções de remoção e o toast NÃO foram chamados
    expect(mockRemoveSelectecClient).not.toHaveBeenCalled();
    expect(Toast.fire).not.toHaveBeenCalled();
  });
});
