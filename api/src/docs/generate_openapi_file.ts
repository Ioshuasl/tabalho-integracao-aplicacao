import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { generateOpenApiDocument } from "./openapi_registry";

const outputPath = path.resolve(process.cwd(), "openapi", "openapi.json");
const document = generateOpenApiDocument();

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(document, null, 2), "utf-8");

console.log(`OpenAPI gerado em ${outputPath}`);
