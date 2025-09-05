# Etapa 1: build da aplicação
FROM node:20-alpine AS build

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para o install
COPY package.json yarn.lock ./

# Instala dependências
RUN yarn install --frozen-lockfile

# Copia o restante dos arquivos
COPY . .

# Executa o build
RUN yarn build

# Etapa 2: servidor NGINX
FROM nginx:stable-alpine AS production

# Limpa html padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expondo porta padrão
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
