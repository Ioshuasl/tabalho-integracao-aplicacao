# Sistema de Entregas — API (Grupo 7)

API do Sistema de Entregas para o trabalho de Integração de Aplicações por Arquivos CSV. Implementa:

- CRUD de entregas e o endpoint de exportação que gera o CSV `sistema_entrega_NNN.csv`, conforme o [contrato de integração Grupo7 → Grupo1](../Contrato_Integracao_CSV_Grupo7_Entregas.md);
- o endpoint de importação do CSV do Sistema Financeiro (`financeiro_lancamentos_<AAAAMMDD>_<NNN>.csv`), conforme o [contrato Grupo6 → Grupo7](../Contrato_Integracao_CSV_Grupo6_Financeiro.md) — validação estrutural e de dados, processamento parcial, arquivo de rejeitados e controle de remessas recebidas.

## Stack

Node.js + TypeScript, Express, Prisma (PostgreSQL), Zod, Swagger (`@asteasolutions/zod-to-openapi` + `swagger-ui-express`), coleção Postman gerada a partir do OpenAPI.

## Arquitetura

Monólito modular em camadas por módulo — cada camada (`endpoint`, `controller`, `service`, `repository`, `schema`, `types`, `enum`) vive na sua própria subpasta dentro de `src/modules/<modulo>/`. O `repository` é uma interface (`types/entregas_types.ts`) implementada por uma classe concreta com Prisma (`repository/entregas_repository.ts`); o `service` depende só da interface (inversão de dependência), sem conhecer o Prisma.

## Como rodar

```bash
docker compose up -d
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

- Entregas: `http://localhost:3000/api/entregas`
- Importação do Financeiro: `POST http://localhost:3000/api/financeiro/importacoes` (multipart/form-data, campo `arquivo`)
- Swagger: `http://localhost:3000/docs`

## Documentação (Swagger + Postman)

A cada endpoint novo/alterado, regenere os artefatos de documentação:

```bash
npm run docs
```

Isso gera `openapi/openapi.json` e `postman/sistema-entregas.postman_collection.json` a partir dos schemas Zod registrados em `src/docs/openapi_registry.ts`.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | sobe a API em modo watch |
| `npm run build` / `npm start` | build e execução em produção |
| `npm run prisma:migrate` | aplica as migrations no Postgres |
| `npm run prisma:studio` | abre o Prisma Studio |
| `npm run docs:generate` | gera `openapi/openapi.json` |
| `npm run docs:postman` | converte o OpenAPI gerado em coleção Postman |
| `npm run docs` | roda os dois acima em sequência |
