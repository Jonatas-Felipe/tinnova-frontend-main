import { darken } from 'polished';
import styled from 'styled-components';

interface ILabel {
  isFocused: boolean;
}

export const Container = styled.div`
  .btn-submit {
    background-color: #ec6724;
    color: #fff;
    transition-duration: 0.3s;
    border-radius: 4px;
    height: 60px;

    :hover {
      background-color: ${darken(0.05, '#EC6724')} !important;
    }
  }
`;

export const Label = styled.label<ILabel>`
  position: relative;
  height: 60px;
  margin: 2.1rem 0;

  .label{
    transition-duration: 0.3s;
    position: absolute;
    font-size: ${props => props.isFocused ? '14px' : '24px'};
    background-color: #F5F5F5;
    top: ${props => props.isFocused ? '0px' : '50%'};
    transform: translateY(-50%);
    left: 10px;
    color: ${props => props.isFocused ? '#202020' : '#ccc'};
    padding: 5px;
    width: ${props => props.isFocused ? 'unset' : 'calc(100% - 16px)'};
  }

  .input {
    height: 60px;

    input {
      font-size: 24px;
    }
  }
`;
