import { Router } from "express";
import { prismaClient } from "../../../config/prisma_client";
import { validateRequest } from "../../../shared/middlewares/validate_request";
import { EntregasController } from "../controller/entregas_controller";
import { EntregasExportController } from "../controller/entregas_export_controller";
import { PrismaEntregaRepository } from "../repository/entregas_repository";
import { PrismaRemessaRepository } from "../repository/remessa_repository";
import { exportEntregasQuerySchema } from "../schema/entregas_export_schema";
import {
  createEntregaBodySchema,
  entregaParamsSchema,
  listEntregasQuerySchema,
  updateEntregaBodySchema,
} from "../schema/entregas_schema";
import { EntregasExportService } from "../service/entregas_export_service";
import { EntregasService } from "../service/entregas_service";

// Composição das dependências (camada mais externa, por isso é aqui que
// a implementação concreta com Prisma é instanciada e injetada nos
// services — o resto do módulo só conhece as interfaces em `types`).
const entregaRepository = new PrismaEntregaRepository(prismaClient);
const remessaRepository = new PrismaRemessaRepository(prismaClient);

const entregasService = new EntregasService(entregaRepository);
const entregasExportService = new EntregasExportService(entregaRepository, remessaRepository);

const entregasController = new EntregasController(entregasService);
const entregasExportController = new EntregasExportController(entregasExportService);

export const entregasRouter = Router();

entregasRouter.post("/entregas", validateRequest({ body: createEntregaBodySchema }), entregasController.create);

entregasRouter.get("/entregas", validateRequest({ query: listEntregasQuerySchema }), entregasController.findMany);

entregasRouter.get(
  "/entregas/:id",
  validateRequest({ params: entregaParamsSchema }),
  entregasController.findById,
);

entregasRouter.put(
  "/entregas/:id",
  validateRequest({ params: entregaParamsSchema, body: updateEntregaBodySchema }),
  entregasController.update,
);

entregasRouter.delete(
  "/entregas/:id",
  validateRequest({ params: entregaParamsSchema }),
  entregasController.remove,
);

entregasRouter.post(
  "/entregas/exportacoes",
  validateRequest({ query: exportEntregasQuerySchema }),
  entregasExportController.exportar,
);
