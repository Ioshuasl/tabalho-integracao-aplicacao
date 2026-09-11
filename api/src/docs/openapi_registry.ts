import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { envConfig } from "../config/env_config";
import { exportEntregasQuerySchema } from "../modules/entregas/schema/entregas_export_schema";
import {
  createEntregaBodySchema,
  entregaParamsSchema,
  entregaResponseSchema,
  listEntregasQuerySchema,
  updateEntregaBodySchema,
} from "../modules/entregas/schema/entregas_schema";
import { importFinanceiroResponseSchema } from "../modules/financeiro/schema/financeiro_schema";

extendZodWithOpenApi(z);

export const openApiRegistry = new OpenAPIRegistry();

// Schema só para documentação: multer trata o multipart/form-data em
// runtime, isso aqui existe apenas para o Swagger/Postman mostrarem o
// campo de upload de arquivo corretamente.
const importFinanceiroRequestSchema = z.object({
  arquivo: z
    .string()
    .openapi({ type: "string", format: "binary" })
    .describe("Arquivo CSV enviado pelo Sistema Financeiro (financeiro_lancamentos_<AAAAMMDD>_<NNN>.csv)"),
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/entregas",
  tags: ["Entregas"],
  summary: "Cria uma nova entrega",
  request: {
    body: { content: { "application/json": { schema: createEntregaBodySchema } } },
  },
  responses: {
    201: {
      description: "Entrega criada com sucesso",
      content: { "application/json": { schema: entregaResponseSchema } },
    },
    422: { description: "Erro de validação" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/entregas",
  tags: ["Entregas"],
  summary: "Lista entregas com paginação e filtros",
  request: { query: listEntregasQuerySchema },
  responses: {
    200: { description: "Lista paginada de entregas" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/entregas/{id}",
  tags: ["Entregas"],
  summary: "Busca uma entrega pelo id",
  request: { params: entregaParamsSchema },
  responses: {
    200: {
      description: "Entrega encontrada",
      content: { "application/json": { schema: entregaResponseSchema } },
    },
    404: { description: "Entrega não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/api/entregas/{id}",
  tags: ["Entregas"],
  summary: "Atualiza uma entrega (substituição completa)",
  request: {
    params: entregaParamsSchema,
    body: { content: { "application/json": { schema: updateEntregaBodySchema } } },
  },
  responses: {
    200: {
      description: "Entrega atualizada",
      content: { "application/json": { schema: entregaResponseSchema } },
    },
    404: { description: "Entrega não encontrada" },
    422: { description: "Erro de validação" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/api/entregas/{id}",
  tags: ["Entregas"],
  summary: "Remove uma entrega",
  request: { params: entregaParamsSchema },
  responses: {
    204: { description: "Entrega removida" },
    404: { description: "Entrega não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/entregas/exportacoes",
  tags: ["Entregas"],
  summary: 'Gera uma nova remessa CSV ("sistema_entrega_NNN.csv") conforme o contrato Grupo7 -> Grupo1',
  request: { query: exportEntregasQuerySchema },
  responses: {
    201: { description: "Arquivo CSV da remessa gerado com sucesso (text/csv)" },
    422: { description: "Erro de validação dos filtros" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/financeiro/importacoes",
  tags: ["Financeiro"],
  summary: "Importa uma remessa CSV do Sistema Financeiro (contrato Grupo6 -> Grupo7)",
  request: {
    body: {
      content: {
        "multipart/form-data": { schema: importFinanceiroRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Remessa processada (pode conter registros rejeitados sem interromper o processamento)",
      content: { "application/json": { schema: importFinanceiroResponseSchema } },
    },
    400: { description: "Nenhum arquivo enviado" },
    409: { description: "Remessa (nome de arquivo) já recebida e processada anteriormente" },
    422: { description: "Arquivo rejeitado por completo: cabeçalho/delimitador/encoding inválido" },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Sistema de Entregas API",
      version: "1.0.0",
      description: "API do Sistema de Entregas (Grupo 7) - Integração de Aplicações por Arquivos CSV",
    },
    // Vira a variável {{baseUrl}} na coleção Postman gerada — precisa ser
    // uma URL absoluta para funcionar de fábrica ao importar a coleção.
    servers: [{ url: `http://localhost:${envConfig.PORT}` }],
  });
}
