import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import Swal from 'sweetalert2';

import { useAuth } from '~/hooks/Auth';
import getValidationErros from '~/utils/getValidationsErrors';

import { Container, Label } from './styles';
import Input from '~/components/Input';

interface IFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handleChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          username: Yup.string().required('O nome de usuário é obrigatório'),
          password: Yup.string().required('A senha é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn({
          username: data.username,
          password: data.password,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors);
        } else {
          Swal.fire('Oops...', 'Ocorreu um erro tente novamente, por favor');
        }
      }
    },
    [signIn]
  );

  return (
    <Container className="vh-100">
      <div className="container h-100">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-lg-5">
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1 className="h2 fw-normal text-center w-100">
                Olá, seja bem-vindo!
              </h1>
              <Label isFocused={usernameFocus} className='d-block w-100'>
                <span className='label'>Nome de Usuário</span>
              <Input
                id='username'
                name="username"
                className="input"
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => username.length === 0 ? setUsernameFocus(false) : undefined}
                onChange={handleChangeUsername}
              />
              </Label>
              <Label isFocused={passwordFocus} className='d-block w-100 my-4'>
                <span className='label'>Senha</span>
              <Input
                id='password'
                type="password"
                name="password"
                className="input"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => password.length === 0 ? setPasswordFocus(false) : undefined}
                onChange={handleChangePassword}
              />
              </Label>
              <button
                type="submit"
                className="btn btn-submit w-100 fs-4 fw-bold"
              >
                Entrar
              </button>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
