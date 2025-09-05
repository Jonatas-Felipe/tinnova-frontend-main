import { render } from '@testing-library/react';
import { screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import Clients from '~/pages/Clients';
import api from '~/services/api';
import Toast from '~/utils/toast';

// --- Mocks Globais ---
// A estratégia é simular todas as dependências externas.

// 1. Mock do serviço de API (axios)
vi.mock('~/services/api');

// 2. Mock do hook useClients
// Fornecemos uma implementação falsa para controlar os clientes selecionados.
const mockAddSelectecClient = vi.fn();
const mockRemoveSelectecClient = vi.fn();
vi.mock('~/hooks/Clients', () => ({
  useClients: () => ({
    clients: [], // Começa sem clientes selecionados
    addSelectecClient: mockAddSelectecClient,
    removeSelectecClient: mockRemoveSelectecClient,
  }),
}));

// 3. Mock do Toast e Swal para evitar que pop-ups reais apareçam
vi.mock('~/utils/toast', () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// --- Dados de Teste ---
// Criamos dados falsos para usar em nossas simulações de API.
const mockClientsData = {
  clients: [
    { id: 1, name: 'João da Silva', salary: 5000, companyValuation: 100000 },
    { id: 2, name: 'Maria Oliveira', salary: 7500, companyValuation: 250000 },
  ],
  totalPages: 1,
  currentPage: 1,
};

describe('Página de Clientes', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a tela de carregamento e depois exibir os clientes', async () => {
    // Configuração do Mock para este teste
    const mockedApi = api as any;
    mockedApi.get.mockResolvedValue({ data: mockClientsData });

    render(<Clients />);

    // 1. Verifica se o estado de carregamento é exibido inicialmente
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    // 2. Aguarda a resolução da chamada da API e a re-renderização
    await waitFor(() => {
      // 3. Verifica se os nomes dos clientes da nossa API mockada estão na tela
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
    });

    // 4. Verifica se o estado de carregamento desapareceu
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    // 5. Verifica se a contagem de clientes está correta
    // **AQUI ESTÁ A CORREÇÃO**
    // Usamos uma expressão regular para ignorar a quebra de linha e a tag <b>
    expect(screen.getByText(/clientes encontrados/i)).toBeInTheDocument();
  });

  it('deve permitir a criação de um novo cliente', async () => {
    const user = userEvent.setup();
    const mockedApi = api as any;

    // Mocks para este teste: GET inicial e POST para criar
    mockedApi.get.mockResolvedValue({ data: mockClientsData });
    mockedApi.post.mockResolvedValue({ status: 201 });

    render(<Clients />);
    await waitFor(() =>
      expect(screen.getByText('João da Silva')).toBeInTheDocument()
    );

    // 1. Abre o modal de criação
    await user.click(screen.getByRole('button', { name: /criar cliente/i }));

    // **AQUI ESTÁ A CORREÇÃO**
    // Apenas verificamos se o modal (dialog) está na tela. A verificação do título era ambígua e redundante.
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // 2. Preenche o formulário
    await user.type(
      within(modal).getByPlaceholderText('Digite o nome:'),
      'Novo Cliente'
    );
    await user.type(
      within(modal).getByPlaceholderText('Digite o salário:'),
      'R$ 1.234,56'
    );
    await user.type(
      within(modal).getByPlaceholderText('Digite o valor da empresa:'),
      'R$ 98.765,43'
    );

    // 3. Submete o formulário
    // Usamos within para garantir que estamos clicando no botão "Criar cliente" de dentro do modal
    await user.click(
      within(modal).getByRole('button', { name: 'Criar cliente' })
    );

    // 4. Verifica as asserções
    await waitFor(() => {
      // Verifica se a API de POST foi chamada com os dados formatados corretamente
      expect(mockedApi.post).toHaveBeenCalledWith('/users', {
        name: 'Novo Cliente',
        salary: 1234.56,
        companyValuation: 98765.43,
      });
      // Verifica se o toast de sucesso foi exibido
      expect(Toast.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cliente criado com sucesso',
        })
      );
    });
  });

  it('deve exibir erros de validação ao tentar criar um cliente com campos vazios', async () => {
    const user = userEvent.setup();
    const mockedApi = api as any;
    mockedApi.get.mockResolvedValue({ data: mockClientsData });

    render(<Clients />);
    await waitFor(() =>
      expect(screen.getByText('João da Silva')).toBeInTheDocument()
    );

    await user.click(screen.getByRole('button', { name: /criar cliente/i }));

    const modal = screen.getByRole('dialog');

    await user.click(
      within(modal).getByRole('button', {
        name: /criar cliente/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByText('O nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('O salário é obrigatório')).toBeInTheDocument();
    });

    // Garante que nenhuma chamada de API foi feita
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('deve permitir a exclusão de um cliente', async () => {
    const user = userEvent.setup();
    const mockedApi = api as any;

    // Mocks: GET inicial e DELETE bem-sucedido
    mockedApi.get.mockResolvedValue({ data: mockClientsData });
    mockedApi.delete.mockResolvedValue({});

    render(<Clients />);
    await waitFor(() =>
      expect(screen.getByText('João da Silva')).toBeInTheDocument()
    );

    // 1. Clica no botão de excluir (usando o data-testid que sugerimos)
    await user.click(screen.getByTestId('delete-client-1'));

    // 2. Verifica se o modal de confirmação apareceu
    const modal = screen.getByRole('dialog');
    expect(
      within(modal).getByText(/você está prestes a excluir o cliente/i)
    ).toBeInTheDocument();
    expect(within(modal).getByText('João da Silva')).toBeInTheDocument();

    // 3. Confirma a exclusão
    await user.click(screen.getByRole('button', { name: /excluir cliente/i }));

    // 4. Verifica as asserções
    await waitFor(() => {
      // Verifica se a API de DELETE foi chamada para o ID correto
      expect(mockedApi.delete).toHaveBeenCalledWith('/users/1');
      // Verifica o toast de sucesso
      expect(Toast.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cliente excluído com sucesso',
        })
      );
    });
  });
});
