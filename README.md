# Sistema de Gerenciamento de Livros - Frontend

Frontend React + TypeScript para o Sistema de Gerenciamento de Livros, integrado com API backend .NET 8.0.

## Descrição

Este projeto é uma aplicação web para gerenciamento de livros, autores e gêneros literários. Permite cadastrar, visualizar, editar e excluir informações sobre livros e seus relacionamentos. A interface é construída com React e TypeScript, oferecendo uma experiência de usuário moderna e responsiva, enquanto se comunica com uma API RESTful desenvolvida em .NET 8.0.

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (versão 6 ou superior)
- Backend .NET 8.0 em execução

## Configuração e Execução

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração do Backend

O frontend está configurado para se conectar ao backend na URL:
```
https://localhost:7115/api/v1
```

Certifique-se de que:
- O backend esteja em execução nesta URL
- O backend esteja usando HTTPS na porta 7115
- A API esteja configurada com CORS para permitir requisições de `http://localhost:3000`

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

O frontend estará disponível em:
```
http://localhost:3000
```

## Estrutura do Projeto

- `/src/components`: Componentes reutilizáveis
- `/src/context`: Contexto da aplicação e gerenciamento de estado
- `/src/models`: Interfaces TypeScript para os modelos de dados
- `/src/pages`: Páginas da aplicação organizadas por entidade
- `/src/services`: Serviços para comunicação com a API

## Funcionalidades

- Listagem, visualização, criação, edição e exclusão de Autores
- Listagem, visualização, criação, edição e exclusão de Gêneros
- Listagem, visualização, criação, edição e exclusão de Livros
- Paginação nas listagens
- Pesquisa de livros

## Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, verifique se o backend está configurado corretamente para permitir requisições do frontend.

### Erro de Conexão
Se encontrar erros como `ERR_INSUFFICIENT_RESOURCES`, verifique:
- Se o backend está em execução
- Se está usando o protocolo correto (HTTPS)
- Se a porta está correta (7115)

### Logs de Erro
Os erros de API são registrados no console do navegador com detalhes para facilitar a depuração.
