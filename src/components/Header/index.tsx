import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Container, MenuButton } from './styles';

import logo from '~/assets/logos/logo.png';
import { useAuth } from '~/hooks/Auth';

import Navbar from '~/components/Navbar';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [location]);

  return (
    <Container className="d-flex align-items-center">
      <div className="container-fluid">
        <div className="row justify-content-between align-items-center">
          <div className="col-2 col-md-1 d-flex justify-content-center">
            <MenuButton
              type="button"
              className="border-0 bg-transparent d-flex flex-column justify-content-between"
              onClick={() => setActive(true)}
              id="menu-button"
            >
              <span></span>
              <span></span>
              <span></span>
            </MenuButton>
          </div>
          <div className="col-2 col-lg-1 d-flex justify-content-center">
            <img src={logo} alt="Teddy Open Finance" />
          </div>
          <div className="col-md-7 col-lg-8 d-none d-md-block">
            <div className="d-flex justify-content-center options">
              <NavLink
                to="/usuarios"
                className={({ isActive }) => (isActive ? 'selected' : '')}
              >
                Usuários
              </NavLink>
              <NavLink
                to="/financas"
                className={({ isActive }) =>
                  `mx-5 ${isActive ? 'selected' : ''}`
                }
              >
                Finanças
              </NavLink>
              <button
                type="button"
                className="border-0 bg-transparent"
                onClick={signOut}
              >
                Sair
              </button>
            </div>
          </div>
          <div className="col-8 col-md-2">
            <p className="mb-0 text-end">
              Olá, <b>{user.username}!</b>
            </p>
          </div>
        </div>
      </div>
      <Navbar active={active} onClick={() => setActive(false)} />
    </Container>
  );
};

export default Header;
