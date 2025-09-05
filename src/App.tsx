import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import HttpsRedirect from 'react-https-redirect';
import 'bootstrap/dist/css/bootstrap.min.css';

import Routes from '~/routes';
import GlobalStyles from './styles/global';

import AppProvider from './hooks';

const App: React.FC = () => {
  return (
    <HttpsRedirect disabled={process.env.NODE_ENV === 'development'}>
      <BrowserRouter>
        <AppProvider>
          <Routes />
        </AppProvider>
        <GlobalStyles />
      </BrowserRouter>
    </HttpsRedirect>
  );
};

export default App;
