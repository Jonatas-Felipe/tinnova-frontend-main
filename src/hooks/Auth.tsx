/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useCallback, useState, useContext } from 'react';
import Swal from 'sweetalert2';

import { useUserStore } from '~/store/userStore';

export interface IUser {
  username: string;
}

interface AuthState {
  user: IUser;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: IUser;
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
  updateUser(user: IUser): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { setUser } = useUserStore();
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@Teddy:user');

    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
      return { user: parsedUser };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(({ username, password }: SignInCredentials) => {
    try {
      const user = {
        username,
      };

      localStorage.setItem('@Teddy:user', JSON.stringify(user));

      setData({
        user,
      });
      setUser(user);
    } catch (error) {
      Swal.fire('Opss...', 'Ocorreu um erro tente novamente', 'error');
    }
  }, [setUser]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('@Teddy:user');
    setData({} as AuthState);
    setUser(null);
  }, [setUser]);

  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem('@Teddy:user', JSON.stringify(user));

      setData({
        user,
      });
      setUser(user);
    },
    [setData, setUser]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
