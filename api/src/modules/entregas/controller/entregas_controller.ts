import type { NextFunction, Request, Response } from "express";
import type {
  CreateEntregaBody,
  EntregaParams,
  ListEntregasQuery,
  UpdateEntregaBody,
} from "../schema/entregas_schema";
import type { EntregasService } from "../service/entregas_service";

// Os tipos de req.params/req.query/req.body abaixo usam "as unknown as":
// o formato genérico do Express (RequestHandler<P, ResBody, ReqBody, ReqQuery>)
// não se integra bem com router.get/post tipados por caminho + generics
// simultaneamente. Como validate_request já garantiu, em runtime, que o
// shape bate exatamente com o schema Zod, o cast aqui é seguro.
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateEntregaBody;
      const entrega = await this.entregasService.create(body);
      res.status(201).json(entrega);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as EntregaParams;
      const body = req.body as UpdateEntregaBody;
      const entrega = await this.entregasService.update(id, body);
      res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as EntregaParams;
      await this.entregasService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as EntregaParams;
      const entrega = await this.entregasService.findById(id);
      res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  };

  findMany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, pageSize, ...filters } = req.query as unknown as ListEntregasQuery;
      const resultado = await this.entregasService.findMany(filters, { page, pageSize });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };
}
