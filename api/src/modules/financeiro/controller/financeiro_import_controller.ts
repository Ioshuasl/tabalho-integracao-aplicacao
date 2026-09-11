import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app_error";
import type { FinanceiroImportService } from "../service/financeiro_import_service";

export class FinanceiroImportController {
  constructor(private readonly financeiroImportService: FinanceiroImportService) {}

  importar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const arquivo = req.file;

      if (!arquivo) {
        throw AppError.badRequest('Nenhum arquivo enviado. Envie o CSV no campo "arquivo" (multipart/form-data).');
      }

      const conteudo = arquivo.buffer.toString("utf-8");
      const resultado = await this.financeiroImportService.importar(arquivo.originalname, conteudo);

      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  };
}
