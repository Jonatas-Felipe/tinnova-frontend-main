import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import { LuPencil } from 'react-icons/lu';
import { FiChevronDown } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { FormHandles } from '@unform/core';
import { AxiosResponse } from 'axios';
import { Spinner } from 'react-bootstrap';

import api from '~/services/api';
import { formatPrice } from '~/utils/format';
import getValidationErros from '~/utils/getValidationsErrors';

import { ClientBox, Container, Modal, Select } from './styles';
import Pagination from '~/components/Pagination';
import Input from '~/components/Input';
import InputMask from '~/components/InputMask';
import { useClients } from '~/hooks/Clients';
import Toast from '~/utils/toast';

interface IClient {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
  selected?: boolean;
}

interface IResponse {
  clients: IClient[];
  totalPages: number;
  currentPage: number;
}

interface IFormData {
  name: string;
  salary: string;
  companyValuation: string;
}

const Clients: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const {
    clients: clientsSelected,
    addSelectecClient,
    removeSelectecClient,
  } = useClients();
  const [clients, setClients] = useState<IClient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(16);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [clientSelected, setClientSelected] = useState({} as IClient);
  const [showDelete, setShowDelete] = useState(false);

  const handleLoadClients = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    const response = await api.get<IResponse>('/users', {
      params: {
        page,
        limit,
      },
    });

    const data = response.data.clients.map((client) => {
      return {
        ...client,
        selected: clientsSelected.some(
          (clientSelected) => clientSelected.id === client.id
        ),
      };
    });

    setClients(data);
    setCurrentPage(response.data.currentPage);
    setTotalPages(response.data.totalPages);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleLoadClients(1, 16);
  }, []);

  const handleChangeLimit = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    handleLoadClients(1, value);
    setLimit(value);
  }, []);

  const handleChangePage = useCallback(
    (pageSelected: number) => {
      window.scrollTo(0, 0);
      handleLoadClients(pageSelected, limit);
      setCurrentPage(pageSelected);
    },
    [limit]
  );

  const options = useMemo(() => {
    return Array.from({ length: 100 }, (_, index) => {
      return {
        value: index + 1,
        label: (index + 1).toString().padStart(2, '0'),
      };
    });
  }, []);

  const handleClickEditClient = useCallback((client: IClient) => {
    setClientSelected(client);
    setShow(true);
  }, []);

  const handleClickDeleteClient = useCallback((client: IClient) => {
    setClientSelected(client);
    setShowDelete(true);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
    setShowDelete(false);
    setClientSelected({} as IClient);
  }, []);

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          salary: Yup.string().required('O salário é obrigatório'),
          companyValuation: Yup.string().required(
            'O valor da empresa é obrigatório'
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        let response: AxiosResponse;

        const formData = {
          name: data.name,
          salary: parseFloat(
            data.salary.replace('R$', '').replaceAll('.', '').replace(',', '.')
          ),
          companyValuation: parseFloat(
            data.companyValuation
              .replace('R$', '')
              .replaceAll('.', '')
              .replace(',', '.')
          ),
        };

        if (Object.keys(clientSelected).length > 0) {
          response = await api.patch(`/users/${clientSelected.id}`, formData);
          if (response.status === 200) {
            const clientIndex = clients.findIndex(
              (client) => client.id === clientSelected.id
            );
            clients[clientIndex].name = formData.name;
            clients[clientIndex].salary = formData.salary;
            clients[clientIndex].companyValuation = formData.companyValuation;
            setClients(clients);

            handleClose();
          }
        } else {
          response = await api.post('/users', formData);

          if (response.status === 201) {
            handleClose();
            handleLoadClients(currentPage, limit);
          }
        }

        Toast.fire({
          icon: 'success',
          iconColor: '#ec6724',
          title: `Cliente ${Object.keys(clientSelected).length > 0 ? 'editado' : 'criado'} com sucesso`,
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
    [clientSelected, clients, currentPage, limit]
  );

  const handleDeleteClient = useCallback(async () => {
    try {
      const clientSelectedData = clientsSelected.find(
        (client) => client.id === clientSelected.id
      );
      if (clientSelectedData) {
        removeSelectecClient(clientSelectedData.id);
      }
      await api.delete(`/users/${clientSelected.id}`);
      handleClose();
      handleLoadClients(currentPage, limit);
      Toast.fire({
        icon: 'success',
        iconColor: '#ec6724',
        title: `Cliente excluído com sucesso`,
      });
    } catch (error) {
      Swal.fire('Oops...', 'Ocorreu um erro tente novamente, por favor');
    }
  }, [clientSelected, currentPage, limit]);

  const handleClickSelectClient = useCallback(
    (client: IClient) => {
      if (client.selected) {
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
            const data = clients.map((clientData) => {
              if (clientData.id === client.id) {
                clientData.selected = false;
              }
              return clientData;
            });
            setClients(data);
          }
        });
      } else {
        addSelectecClient(client);
        const data = clients.map((clientData) => {
          if (clientData.id === client.id) {
            clientData.selected = true;
          }
          return clientData;
        });
        setClients(data);
        Toast.fire({
          icon: 'success',
          iconColor: '#ec6724',
          title: 'Cliente selecionado com sucesso',
        });
      }
    },
    [clients]
  );

  return (
    <Container>
      <div className="container pt-5">
        <div className="row align-items-center">
          <div className="col-sm-6 mb-4">
            <p className="mb-0">
              <b>{clients.length}</b> clientes encontrados
            </p>
          </div>
          <div className="col-sm-6 mb-4 d-flex justify-content-end align-items-center">
            <p className="mb-0">Clientes por página: </p>
            <Select className="d-flex align-items-center justify-content-between">
              <select onChange={handleChangeLimit}>
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    selected={option.value === limit}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown size={15} color="#D9D9D9" />
            </Select>
          </div>
          {clients.length === 0 && (
            <div className="col-12 d-flex align-items-center justify-content-center py-5">
              <p className="fs-4 fw-bold mb-0 not-selected">
                Nenhum cliente cadastrado
              </p>
            </div>
          )}
          {clients.map((client) => (
            <div key={client.id} className="col-sm-6 col-lg-3 mb-4">
              <ClientBox className="d-flex flex-column justify-content-center align-items-center">
                <h3 className="fs-6 fw-bold mb-0">{client.name}</h3>
                <p className="my-2">Salário: {formatPrice(client.salary)}</p>
                <p className="mb-2">
                  Empresa: {formatPrice(client.companyValuation)}
                </p>
                <div className="d-flex justify-content-between w-100">
                  <button
                    type="button"
                    className="border-0 bg-transparent btn-select"
                    onClick={() => handleClickSelectClient(client)}
                  >
                    {client.selected ? (
                      <FaMinus size={20} color="#000" />
                    ) : (
                      <FaPlus size={20} color="#000" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent btn-update"
                    onClick={() => handleClickEditClient(client)}
                  >
                    <LuPencil size={20} color="#000" />
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent"
                    onClick={() => handleClickDeleteClient(client)}
                    data-testid={`delete-client-${client.id}`}
                  >
                    <GoTrash size={20} color="#F00" />
                  </button>
                </div>
              </ClientBox>
            </div>
          ))}
          <div className="col-12">
            <button
              type="button"
              className="btn btn-create"
              onClick={() => setShow(true)}
            >
              Criar cliente
            </button>
          </div>
          <div className="col-12 mb-5">
            <Pagination
              onChangePage={handleChangePage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={clientSelected}
        >
          <Modal.Header className="border-0">
            <Modal.Title className="fw-bold mb-0 fs-6">
              {Object.keys(clientSelected).length > 0
                ? 'Editar cliente'
                : 'Criar cliente'}
            </Modal.Title>
            <button type="button" className="btn-close" onClick={handleClose} />
          </Modal.Header>
          <Modal.Body>
            <Input name="name" placeholder="Digite o nome:" className="input" />
            <InputMask
              kind="money"
              name="salary"
              placeholder="Digite o salário:"
              className="input"
              value={
                Object.keys(clientSelected).length > 0
                  ? clientSelected.salary.toFixed(2)
                  : undefined
              }
            />
            <InputMask
              kind="money"
              name="companyValuation"
              placeholder="Digite o valor da empresa:"
              className="input"
              value={
                Object.keys(clientSelected).length > 0
                  ? clientSelected.companyValuation.toFixed(2)
                  : undefined
              }
            />
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button type="submit" className="btn btn-submit">
              {Object.keys(clientSelected).length > 0
                ? 'Editar cliente'
                : 'Criar cliente'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header className="border-0">
          <Modal.Title className="fw-bold mb-0 fs-6">
            Excluir cliente:
          </Modal.Title>
          <button type="button" className="btn-close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <p>
            Você está prestes a excluir o cliente: <b>{clientSelected.name}</b>
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button
            type="button"
            className="btn btn-submit"
            onClick={handleDeleteClient}
          >
            Excluir cliente
          </button>
        </Modal.Footer>
      </Modal>
      {loading && (
        <div className="loading d-flex justify-content-center align-items-center">
          <button className="btn btn-primary ms-3" type="button" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2">Carregando...</span>
          </button>
        </div>
      )}
    </Container>
  );
};

export default Clients;
