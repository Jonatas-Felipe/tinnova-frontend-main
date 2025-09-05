import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import Login from '~/pages/Login';
import { useAuth } from '~/hooks/Auth';

// --- Mocks ---
// Mantemos os mocks no topo, eles são a nossa "configuração" inicial.

// Criamos uma referência para a função signIn que poderemos usar em todos os testes.
const mockSignIn = vi.fn();

vi.mock('~/hooks/Auth', () => ({
  // Simplificamos o mock para retornar a função que criamos acima.
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock do Swal continua o mesmo.
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('Login Component', () => {
  // Limpamos o estado de todos os mocks antes de cada teste para garantir isolamento.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Renderiza corretamente o formulário de login', () => {
    render(<Login />);
    expect(screen.getByText('Olá, seja bem-vindo!')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite o seu nome:')
    ).toBeInTheDocument();
    // 2. Melhoramos o seletor para buscar por "role" de botão, que é mais acessível.
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('Envia o formulário com sucesso com dados válidos', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const input = screen.getByPlaceholderText('Digite o seu nome:');
    const button = screen.getByRole('button', { name: /entrar/i });

    // 3. Simulamos o usuário digitando e clicando.
    await user.type(input, 'John Doe');
    await user.click(button);

    await waitFor(() => {
      // 4. Verificamos se o mock (definido fora do teste) foi chamado corretamente.
      expect(mockSignIn).toHaveBeenCalledWith({ name: 'John Doe' });
    });
  });

  it('Exibe erro de validação quando o formulário é enviado com nome vazio', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const button = screen.getByRole('button', { name: /entrar/i });
    await user.click(button);

    // O teste deve verificar o resultado final que o usuário vê na tela.
    // Deixe o Unform e o Yup fazerem seu trabalho real.
    await waitFor(() => {
      expect(screen.getByText('O seu nome é obrigatório')).toBeInTheDocument();
    });

    // Verifique também que a função de login não foi chamada
    const { signIn } = useAuth();
    expect(signIn).not.toHaveBeenCalled();
  });
});
