import styled from 'styled-components';

interface IMenuProps {
  active: boolean;
}

export const Container = styled.div<IMenuProps>`
  width: 260px;
  min-height: 100vh;
  transition-duration: 0.3s;
  position: fixed;
  top: 0;
  left: ${(props) => (props.active ? 0 : '-200%')};
`;

export const Menu = styled.div`
  position: relative;
  width: 260px;
  background-color: #ffffff;
  min-height: 100vh;
  top: 0;
  left: 0;
  border-radius: 8px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;
  z-index: 2;

  .logo-box {
    width: 100%;
    height: 128px;
    background-color: #393939;

    img {
      filter: brightness(100);
    }
  }

  button:not(.not-path),
  a {
    color: #141414;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
    line-height: 15px;
    svg {
      width: 24px;
      height: 24px;
      color: #141414;
      margin-right: 5px !important;
      path:not(.question-mark) {
        fill: #141414;
      }
    }

    :hover:not(.btn-arrow) {
      color: #ee7d46 !important;
      span {
        color: #ee7d46 !important;
      }
      svg {
        color: #ee7d46 !important;
        path:not(.question-mark) {
          fill: #ee7d46 !important;
        }
      }
    }
  }

  .active {
    color: #ee7d46 !important;
    span {
      color: #ee7d46 !important;
    }
    svg {
      color: #ee7d46 !important;
      path:not(.question-mark) {
        fill: #ee7d46 !important;
      }
    }
  }

  .btn-arrow {
    top: 108px;
    right: -20px;
    width: 42px;
    height: 42px;
    background-color: #1f1f1f;
    border-radius: 50%;
    box-shadow: 0px 4px 8px 0px #0000001a;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      transition: all 0.2s ease-in-out;
    }
  }
`;
