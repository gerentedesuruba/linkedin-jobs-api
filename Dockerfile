# Usar uma imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos de dependência e instalar
# Usamos um wildcard para copiar tanto package.json quanto package-lock.json
COPY package*.json ./
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
