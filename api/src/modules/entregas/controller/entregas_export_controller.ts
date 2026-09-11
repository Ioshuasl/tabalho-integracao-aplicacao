import type { NextFunction, Request, Response } from "express";
import type { ExportEntregasQuery } from "../schema/entregas_export_schema";
import type { EntregasExportService } from "../service/entregas_export_service";

export class EntregasExportController {
  constructor(private readonly entregasExportService: EntregasExportService) {}

  exportar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filtros = req.query as unknown as ExportEntregasQuery;
      const resultado = await this.entregasExportService.exportar(filtros);

      res.status(201);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${resultado.nomeArquivo}"`);
      res.setHeader("X-Remessa-Numero", String(resultado.numeroRemessa));
      res.setHeader("X-Total-Registros", String(resultado.totalRegistros));
      res.send(resultado.conteudoCsv);
    } catch (error) {
      next(error);
    }
  };
}
