import styled from 'styled-components';

export const Container = styled.header`
  height: 100px;
  background-color: #ffffff;
  box-shadow: 0px 2px 2px 0px #0000001a;

  .options {
    a,
    button {
      color: #000000;
      transition-duration: 0.3s;

      :hover {
        color: #6161ff;
        text-decoration: underline !important;
      }
    }

    a.selected {
      color: #6161ff;
      text-decoration: underline !important;
    }
  }
`;

export const MenuButton = styled.button`
  width: 24px;
  height: 20px;

  span {
    display: block;
    width: 100%;
    height: 3px;
    border-radius: 50px;
    background-color: #666666;
  }
`;
