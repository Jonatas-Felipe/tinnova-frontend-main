import React, { useCallback, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';
import { GoSignOut } from 'react-icons/go';
import { IoMdHome } from 'react-icons/io';
import { FaUsers } from 'react-icons/fa6';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

import { Container, Menu } from './styles';

import logo from '~/assets/logos/logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '~/hooks/Auth';

interface INavBar {
  active: boolean;
  onClick: () => void;
}

const NavBar: React.FC<INavBar> = ({ active, onClick }) => {
  const { signOut } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (target.closest('#menu-button') === null) {
          onClick();
        }
      }
    }

    document.addEventListener('mousedown', handleClickFora);

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, []);

  const hanldeClickArrow = useCallback(() => {
    onClick();
  }, []);

  return (
    <Container ref={containerRef} active={active}>
      <Menu className="d-flex flex-column justify-content-between">
        <button
          type="button"
          className="not-path zoom border-0 btn-arrow position-absolute"
          onClick={hanldeClickArrow}
        >
          <IoArrowBackCircle size={16} color="#fff" />
        </button>
        <div className={`align-items-start zoom d-flex flex-column`}>
          <div className="logo-box d-flex align-items-center justify-content-center px-4">
            <img src={logo} alt="logo" />
          </div>

          <Link
            to={`/usuarios`}
            className="d-flex align-items-center mt-4 px-4"
          >
            <IoMdHome size={20} /> <span>Home</span>
          </Link>

          <NavLink
            to={`/usuarios`}
            className={({ isActive }) =>
              `d-flex align-items-center mt-4 px-4 ${isActive ? 'active' : ''}`
            }
          >
            <FaUsers size={20} /> <span>Usuários</span>
          </NavLink>

          <NavLink
            to={`/financas`}
            className={({ isActive }) =>
              `d-flex align-items-center mt-4 px-4 ${isActive ? 'active' : ''}`
            }
          >
            <RiMoneyDollarCircleFill size={20} /> <span>Finanças</span>
          </NavLink>
          <button
            type="button"
            className="border-0 bg-transparent d-flex d-md-none align-items-center mt-4 px-4"
            onClick={signOut}
          >
            <GoSignOut size={20} /> Sair
          </button>
        </div>
      </Menu>
    </Container>
  );
};

export default NavBar;
