# Desafio – VirteX - Desenvolvimento

## Pré Requisitos

- Docker (https://github.com/codeedu/wsl2-docker-quickstart)
- Node.js (20+) (https://nodejs.org/en/download/)

## Instalação

Copie os arquivos de variáveis de ambiente para os diretórios do backend e frontend:

```bash
cp virtex-olt-backend/.env.example virtex-olt-backend/.env && cp virtex-olt-frontend/.env.example virtex-olt-frontend/.env
```

Instale as dependências do backend e do frontend:

```bash
cd virtex-olt-backend && npm install && cd ../virtex-olt-frontend && npm install && cd ..
```

## Execução

Inicie o banco de dados:

```bash
docker compose up -d --build
```

Inicie o backend e o frontend em terminais separados.

Backend:

```bash
cd virtex-olt-backend && npx prisma migrate dev && npm run dev
```

Frontend:

```bash
cd virtex-olt-frontend && npm run dev
```

Depois de iniciar o backend e o frontend, acesse o endereço http://localhost:5173/ no seu navegador.

<!-- ### Basta executar o docker compose e ir para o endereço http://localhost:3000

```bash
docker-compose up -d --build
```

### Comando completo

```bash
cp virtex-olt-backend/.env.example virtex-olt-backend/.env && cp virtex-olt-frontend/.env.example virtex-olt-frontend/.env && docker compose up -d --build
```

Obs: O banco de dados demora um pouco para iniciar, então se der erro de conexão, aguarde alguns segundos e tente novamente. -->

---

Caso tenha dúvidas, entre em contato comigo pelo email: devrenangabriel@gmail.com
