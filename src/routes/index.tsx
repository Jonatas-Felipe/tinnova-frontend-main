import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import RouteWrapper from './RouteWrapper';

import Login from '~/pages/Login';

const UsersApp = lazy(() => import('topUsers/App'));
// const FinanceApp = lazy(() => import('topFinance/App'));

const routes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RouteWrapper element={<Login />} />} />
      <Route path="/usuarios" element={
        <Suspense fallback={<div>Carregando microfrontend de usuários...</div>}>
          <RouteWrapper element={<UsersApp />} isPrivate />
        </Suspense>
      } />
      {/* <Route path="/financas" element={
        <Suspense fallback={<div>Carregando microfrontend de usuários...</div>}>
          <RouteWrapper element={<FinanceApp />} isPrivate />
        </Suspense>
      } /> */}
    </Routes>
  );
};

export default routes;
