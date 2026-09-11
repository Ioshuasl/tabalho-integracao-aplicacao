import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

interface RequestSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Middleware genérico de validação: substitui body/query/params pelo
 * resultado do parse do Zod (já com coerções e defaults aplicados).
 * Erros de validação (ZodError) são lançados de forma síncrona e
 * capturados automaticamente pelo Express, chegando ao error_handler.
 */
export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    next();
  };
}
