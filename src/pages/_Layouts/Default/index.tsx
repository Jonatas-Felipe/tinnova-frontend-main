import React from 'react';

import Header from '~/components/Header';

const DefaultLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default DefaultLayout;
