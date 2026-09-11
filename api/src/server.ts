import { createApp } from "./app";
import { envConfig } from "./config/env_config";
import { prismaClient } from "./config/prisma_client";

async function bootstrap(): Promise<void> {
  await prismaClient.$connect();

  const app = createApp();

  app.listen(envConfig.PORT, () => {
    console.log(`Sistema de Entregas API rodando na porta ${envConfig.PORT}`);
    console.log(`Documentação Swagger em http://localhost:${envConfig.PORT}/docs`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar a aplicação", error);
  process.exit(1);
});
