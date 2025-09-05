import styled from 'styled-components';
import { Modal as ModalComponent } from 'react-bootstrap';
import { darken } from 'polished';

export const Container = styled.div`
  .btn-create {
    width: 100%;
    height: 40px;
    font-size: 14px;
    border: 1px solid #ec6724;
    border-radius: 4px;
    color: #ec6724;
    transition-duration: 0.3s;

    :hover {
      background-color: #ec6724;
      color: #fff;
    }
  }

  .not-selected {
    opacity: 0.5;
  }

  .loading {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #00000022;
  }
`;

export const Select = styled.label`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  position: relative;
  width: 50px;
  height: 25px;
  margin-left: 5px;

  select {
    padding: 0 5px;
    width: 100%;
    border-color: transparent;
    background-color: transparent;
    color: #000;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  svg {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const ClientBox = styled.div`
  width: 100%;
  height: 138px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 0px 4px 0px #0000001a;
  padding: 15px 16px;

  p {
    font-size: 14px;
  }
`;

export const Modal = styled(ModalComponent)`
  .input {
    border-width: 2px;
    height: 40px;
  }

  .btn-submit {
    width: 100%;
    height: 40px;
    background-color: #ec6724;
    color: #fff;
    border-radius: 4px;
    transition-duration: 0.3s;
    font-size: 14px;
    font-weight: 700;

    :hover {
      background-color: ${darken(0.05, '#EC6724')} !important;
    }
  }
`;
