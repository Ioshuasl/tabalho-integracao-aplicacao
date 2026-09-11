import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface CsvWriteOptions {
  delimiter: string;
  lineBreak: string;
}

/**
 * Aplica aspas somente quando o valor contém o delimitador, aspas ou
 * quebra de linha — regra explícita dos contratos CSV deste trabalho
 * (aspas não são usadas em todo campo, só quando necessário).
 */
export function escapeCsvField(value: string, delimiter: string): string {
  const precisaDeAspas = value.includes(delimiter) || value.includes('"') || value.includes("\n") || value.includes("\r");

  if (!precisaDeAspas) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsvContent(header: string[], rows: string[][], options: CsvWriteOptions): string {
  const linhas = [header, ...rows].map((colunas) =>
    colunas.map((valor) => escapeCsvField(valor, options.delimiter)).join(options.delimiter),
  );

  return linhas.join(options.lineBreak) + options.lineBreak;
}

/**
 * Escreve em UTF-8 sem BOM: fs.writeFileSync com encoding "utf-8" não
 * adiciona BOM por padrão (só apareceria se prefixássemos "﻿").
 */
export function writeCsvFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, { encoding: "utf-8" });
}
