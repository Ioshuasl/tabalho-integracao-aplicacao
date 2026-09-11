import path from "node:path";
import { buildCsvContent, writeCsvFile } from "../../../shared/utils/csv_writer";
import type { EntregaFilters, EntregaRepository } from "../types/entregas_types";
import type { RemessaRepository } from "../types/remessa_types";
import { ENTREGAS_CSV_HEADER, buildNomeArquivoRemessa, mapEntregaParaLinhaCsv } from "../utils/entregas_csv_mapper";

const CSV_DELIMITER = ";";
const CSV_LINE_BREAK = "\n";
const EXPORTS_DIR = path.resolve(process.cwd(), "data", "exports");

export interface ExportResult {
  numeroRemessa: number;
  nomeArquivo: string;
  caminhoArquivo: string;
  totalRegistros: number;
  conteudoCsv: string;
}

export class EntregasExportService {
  constructor(
    private readonly entregaRepository: EntregaRepository,
    private readonly remessaRepository: RemessaRepository,
  ) {}

  async exportar(filters: EntregaFilters): Promise<ExportResult> {
    const entregas = await this.entregaRepository.findManyForExport(filters);

    // Numeração sequencial que nunca reinicia (Seção 5 do contrato):
    // o próximo número sempre parte do último persistido no banco.
    const ultimoNumero = await this.remessaRepository.getUltimoNumero();
    const numeroRemessa = ultimoNumero + 1;
    const nomeArquivo = buildNomeArquivoRemessa(numeroRemessa);

    const linhas = entregas.map((entrega) => mapEntregaParaLinhaCsv(entrega));
    const conteudoCsv = buildCsvContent(ENTREGAS_CSV_HEADER, linhas, {
      delimiter: CSV_DELIMITER,
      lineBreak: CSV_LINE_BREAK,
    });

    const caminhoArquivo = path.join(EXPORTS_DIR, nomeArquivo);
    writeCsvFile(caminhoArquivo, conteudoCsv);

    await this.remessaRepository.create({
      numero: numeroRemessa,
      nomeArquivo,
      totalRegistros: entregas.length,
    });

    return {
      numeroRemessa,
      nomeArquivo,
      caminhoArquivo,
      totalRegistros: entregas.length,
      conteudoCsv,
    };
  }
}
