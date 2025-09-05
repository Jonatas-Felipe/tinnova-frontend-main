/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';

export interface IClient {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
}

interface ClientContextData {
  clients: IClient[];
  addSelectecClient(client: IClient): Promise<void>;
  removeSelectecClient(client_id: number): void;
  removeAllSelectecClients(): void;
}

export const ClientsContext = createContext<ClientContextData>(
  {} as ClientContextData
);

export const ClientsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [clients, setClients] = useState<IClient[]>(() => {
    const clientsData = localStorage.getItem('@Teddy:clientsSelected');

    if (clientsData) {
      return JSON.parse(clientsData);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@Teddy:clientsSelected', JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = useCallback(async (client: IClient) => {
    setClients((oldState) => [...oldState, client]);
  }, []);

  const handleRemoveClient = useCallback(async (client_id: number) => {
    setClients((oldState) =>
      oldState.filter((client) => client.id !== client_id)
    );
  }, []);

  const handleRemoveAllClients = useCallback(async () => {
    setClients([]);
  }, []);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addSelectecClient: handleAddClient,
        removeSelectecClient: handleRemoveClient,
        removeAllSelectecClients: handleRemoveAllClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export function useClients(): ClientContextData {
  const context = useContext(ClientsContext);

  if (!context) {
    throw new Error('useClient must be used within an ClientProvider');
  }

  return context;
}
