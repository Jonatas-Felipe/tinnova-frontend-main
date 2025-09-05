import React, { useCallback } from 'react';
import { FaMinus } from 'react-icons/fa6';
import Swal from 'sweetalert2';

import { formatPrice } from '~/utils/format';

import { ClientBox, Container } from './styles';
import { IClient, useClients } from '~/hooks/Clients';
import Toast from '~/utils/toast';

const Clients: React.FC = () => {
  const { clients, removeSelectecClient, removeAllSelectecClients } =
    useClients();

  const handleClickUnselectClient = useCallback(
    (client: IClient) => {
      Swal.fire({
        icon: 'warning',
        iconColor: '#ec6724',
        title: `Gostaria de desselecionar ${client.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonText: 'Sim',
        confirmButtonColor: '#ec6724',
        reverseButtons: true,
      }).then((e) => {
        if (e.isConfirmed) {
          Toast.fire({
            icon: 'success',
            iconColor: '#ec6724',
            title: 'Cliente desselecionado com sucesso',
          });
          removeSelectecClient(client.id);
        }
      });
    },
    [clients]
  );

  const handleClickUnselectAll = useCallback(() => {
    Swal.fire({
      icon: 'warning',
      iconColor: '#ec6724',
      title: `Gostaria de limpar todos os clientes selecionados?`,
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim',
      confirmButtonColor: '#ec6724',
      reverseButtons: true,
    }).then((e) => {
      if (e.isConfirmed) {
        Toast.fire({
          icon: 'success',
          iconColor: '#ec6724',
          title: 'Todos os clientes foram desselecionados com sucesso',
        });
        removeAllSelectecClients();
      }
    });
  }, [clients]);

  return (
    <Container>
      <div className="container pt-5">
        <div className="row align-items-center">
          <div className="col-12 mb-4">
            <p className="fs-4 fw-bold mb-0">Clientes selecionados:</p>
          </div>
          {clients.length === 0 && (
            <div className="col-12 d-flex align-items-center justify-content-center py-5">
              <p className="fs-4 fw-bold mb-0 not-selected">
                Nenhum cliente selecionado ainda
              </p>
            </div>
          )}
          {clients.map((client) => (
            <div key={client.id} className="col-lg-3 mb-4">
              <ClientBox className="ClientBox d-flex flex-column justify-content-center align-items-center">
                <h3 className="fs-6 fw-bold mb-0">{client.name}</h3>
                <p className="my-2">Salário: {formatPrice(client.salary)}</p>
                <p className="mb-2">
                  Empresa: {formatPrice(client.companyValuation)}
                </p>
                <div className="d-flex justify-content-end w-100">
                  <button
                    type="button"
                    className="border-0 bg-transparent btn-unselect"
                    onClick={() => handleClickUnselectClient(client)}
                  >
                    <FaMinus size={20} color="#F00" />
                  </button>
                </div>
              </ClientBox>
            </div>
          ))}
          {clients.length > 0 && (
            <div className="col-12 mb-5">
              <button
                type="button"
                className="btn btn-clean"
                onClick={handleClickUnselectAll}
              >
                Limpar clientes selecionados
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Clients;
