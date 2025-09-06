# Frontend Principal

> Este repositório contém a interface do login e orquestração dos microfrontends. Ele atua como [host] na arquitetura de microfrontends da aplicação.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- **[React](https://react.dev/)** (v19.x)
- **[Vite](https://vitejs.dev/)** como build tool e servidor de desenvolvimento
- **[TypeScript](https://www.typescriptlang.org/)** para tipagem estática
- **[Styled-Components](https://styled-components.com/)** para estilização CSS-in-JS
- **[Vitest](https://vitest.dev/)** para testes unitários
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** para testes de componentes

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/) (v20.x ou superior)
- [Yarn](https://yarnpkg.com/) (ou `npm`)

---

## ⚙️ Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Jonatas-Felipe/tinnova-frontend-main.git
    cd tinnova-frontend-main
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```
---

## ▶️ Execução

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento com hot-reload (recarregamento automático ao salvar):

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3001`.

### Build de Produção

Para gerar a versão otimizada para produção:

```bash
yarn build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

---

## ✅ Testes

Os testes unitários e de integração são escritos com Vitest e React Testing Library.

### Como Rodar os Testes

- **Para rodar a suíte de testes uma vez:**
  ```bash
  yarn test
  ```

- **Para rodar os testes com a interface gráfica interativa do Vitest:**
  ```bash
  yarn test:ui
  ```

Isso abrirá uma aba no seu navegador onde você pode visualizar os resultados, filtrar testes e ver detalhes dos erros de forma mais amigável.
