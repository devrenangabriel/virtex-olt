# Desafio – VirteX - Desenvolvimento

## Pré Requisitos

- Docker (https://github.com/codeedu/wsl2-docker-quickstart)

## Instalação

### Copie os arquivos de variáveis de ambiente para os diretórios do backend e frontend

```bash
cp virtex-olt-backend/.env.example virtex-olt-backend/.env && cp virtex-olt-frontend/.env.example virtex-olt-frontend/.env
```

## Execução

### Basta executar o docker compose e ir para o endereço http://localhost:3000

```bash
docker-compose up -d --build
```

### Comando completo

```bash
cp virtex-olt-backend/.env.example virtex-olt-backend/.env && cp virtex-olt-frontend/.env.example virtex-olt-frontend/.env && docker compose up -d --build
```

### Obs: O banco de dados demora um pouco para iniciar, então se der erro de conexão, aguarde alguns segundos e tente novamente.

---

Caso tenha dúvidas, entre em contato comigo pelo email: devrenangabriel@gmail.com
