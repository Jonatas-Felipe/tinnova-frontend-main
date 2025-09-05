import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { loadRemote } from '@module-federation/runtime';


import RouteWrapper from './RouteWrapper';

import Login from '~/pages/Login';

const UsersApp = lazy(() => loadRemote<any>('topUsers/App').then((module) => ({ default: module })),);
const FinanceApp = lazy(() => loadRemote<any>('topFinance/App').then((module) => ({ default: module })),);

const routes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RouteWrapper element={<Login />} />} />
      <Route path="/usuarios" element={
        <Suspense fallback={<div>Carregando microfrontend de usuários...</div>}>
          <RouteWrapper element={<UsersApp />} isPrivate />
        </Suspense>
      } />
      <Route path="/financas" element={
        <Suspense fallback={<div>Carregando microfrontend de finaças...</div>}>
          <RouteWrapper element={<FinanceApp />} isPrivate />
        </Suspense>
      } />
    </Routes>
  );
};

export default routes;
