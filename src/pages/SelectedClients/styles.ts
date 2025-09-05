import styled from 'styled-components';

export const Container = styled.div`
  .btn-clean {
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
