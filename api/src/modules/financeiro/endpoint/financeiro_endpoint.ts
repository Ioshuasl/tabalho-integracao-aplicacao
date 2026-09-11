import { Router } from "express";
import multer from "multer";
import { prismaClient } from "../../../config/prisma_client";
import { FinanceiroImportController } from "../controller/financeiro_import_controller";
import { PrismaLancamentoFinanceiroRepository } from "../repository/financeiro_repository";
import { PrismaRemessaFinanceiraRepository } from "../repository/remessa_financeira_repository";
import { FinanceiroImportService } from "../service/financeiro_import_service";

// Composição das dependências, assim como em entregas_endpoint.ts: a
// implementação concreta com Prisma só é instanciada aqui, na camada mais
// externa, e injetada no service através da interface.
const lancamentoRepository = new PrismaLancamentoFinanceiroRepository(prismaClient);
const remessaFinanceiraRepository = new PrismaRemessaFinanceiraRepository(prismaClient);

const financeiroImportService = new FinanceiroImportService(lancamentoRepository, remessaFinanceiraRepository);
const financeiroImportController = new FinanceiroImportController(financeiroImportService);

// Armazenamento em memória: o CSV é pequeno (arquivo de lote financeiro),
// não há necessidade de gravar o upload em disco antes de processá-lo.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const financeiroRouter = Router();

financeiroRouter.post("/financeiro/importacoes", upload.single("arquivo"), financeiroImportController.importar);
