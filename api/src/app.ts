import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./docs/openapi_registry";
import { entregasRouter } from "./modules/entregas/endpoint/entregas_endpoint";
import { financeiroRouter } from "./modules/financeiro/endpoint/financeiro_endpoint";
import { errorHandler } from "./shared/middlewares/error_handler";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  const openApiDocument = generateOpenApiDocument();
  app.get("/docs.json", (_req, res) => res.json(openApiDocument));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/api", entregasRouter);
  app.use("/api", financeiroRouter);

  // Precisa ser o último app.use: middleware de erro só é reconhecido
  // pelo Express por ter 4 parâmetros, e só captura o que vier antes dele.
  app.use(errorHandler);

  return app;
}
