import React from 'react';

import { AuthProvider } from './Auth';
import { ResizeProvider } from './Resize';
import { ClientsProvider } from './Clients';

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ResizeProvider>
      <AuthProvider>
        <ClientsProvider>{children}</ClientsProvider>
      </AuthProvider>
    </ResizeProvider>
  );
};

export default AppProvider;
