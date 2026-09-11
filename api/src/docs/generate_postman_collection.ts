import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { convert } from "openapi-to-postmanv2";

const openApiPath = path.resolve(process.cwd(), "openapi", "openapi.json");

if (!existsSync(openApiPath)) {
  console.error(`Arquivo ${openApiPath} não encontrado. Rode "npm run docs:generate" antes.`);
  process.exit(1);
}

const openApiJson = readFileSync(openApiPath, "utf-8");

convert({ type: "string", data: openApiJson }, {}, (error, result) => {
  if (error) {
    console.error("Falha ao converter OpenAPI para Postman:", error);
    process.exit(1);
  }

  if (!result.result) {
    console.error("Conversão para Postman falhou:", result.reason);
    process.exit(1);
  }

  const outputPath = path.resolve(process.cwd(), "postman", "sistema-entregas.postman_collection.json");
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(result.output[0]?.data, null, 2), "utf-8");

  console.log(`Coleção Postman gerada em ${outputPath}`);
});
