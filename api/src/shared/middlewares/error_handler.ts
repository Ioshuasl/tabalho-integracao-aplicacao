import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app_error";

// Assinatura com 4 parâmetros é o que faz o Express reconhecer isto como
// middleware de tratamento de erro (mesmo sem usar _req/_next).
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(422).json({
      message: "Erro de validação",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Erro interno do servidor" });
}
