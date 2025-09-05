import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Swal from 'sweetalert2';

import Login from '~/pages/Login';

const mockSignIn = vi.fn();

vi.mock('~/hooks/Auth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

vi.mock('sweetalert2', async (importOriginal) => {
  const mod = await importOriginal() as any;
  return {
    ...mod,
    default: {
      ...mod.default,
      fire: vi.fn(),
    },
  };
});

const renderComponent = () => render(<Login />);

describe('Página: Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve renderizar o formulário de login corretamente', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: /olá, seja bem-vindo!/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('Deve exibir erros de validação ao submeter o formulário vazio', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/o nome de usuário é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/a senha é obrigatória/i),
    ).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('Deve chamar a função signIn com os dados corretos ao submeter um formulário válido', async () => {
    const user = userEvent.setup();
    renderComponent();

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('Deve exibir um alerta de erro se a função signIn falhar com um erro genérico', async () => {
    mockSignIn.mockImplementation(() => {
      throw new Error('Erro de API');
    });

    const user = userEvent.setup();
    renderComponent();

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Oops...',
        'Ocorreu um erro tente novamente, por favor',
      );
    });
  });
});
