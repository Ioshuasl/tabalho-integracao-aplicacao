import path from "node:path";
import { AppError } from "../../../shared/errors/app_error";
import { buildCsvContent, writeCsvFile } from "../../../shared/utils/csv_writer";
import { parseCsv } from "../../../shared/utils/csv_reader";
import { lancamentoRowSchema } from "../schema/financeiro_schema";
import type { CreateLancamentoData, LancamentoFinanceiroRepository } from "../types/financeiro_types";
import type { RemessaFinanceiraRepository } from "../types/remessa_financeira_types";
import {
  LANCAMENTOS_CSV_HEADER,
  REJEITADOS_CSV_HEADER,
  buildNomeArquivoRejeitados,
  mapColunasParaLancamento,
} from "../utils/financeiro_csv_mapper";

const CSV_DELIMITER = ";";
const CSV_LINE_BREAK = "\n";
const IMPORTS_REJEITADOS_DIR = path.resolve(process.cwd(), "data", "imports", "rejeitados");

interface ErroLinha {
  linha: number;
  motivo: string;
  dadosOriginais: string;
}

export interface ImportResult {
  nomeArquivo: string;
  totalLido: number;
  totalProcessado: number;
  totalRejeitado: number;
  erros: Array<{ linha: number; motivo: string }>;
  nomeArquivoRejeitados: string | null;
}

export class FinanceiroImportService {
  constructor(
    private readonly lancamentoRepository: LancamentoFinanceiroRepository,
    private readonly remessaFinanceiraRepository: RemessaFinanceiraRepository,
  ) {}

  async importar(nomeArquivo: string, conteudo: string): Promise<ImportResult> {
    await this.garantirRemessaInedita(nomeArquivo);
    this.garantirEncodingLegivel(conteudo);

    const linhas = parseCsv(conteudo, CSV_DELIMITER);
    const linhasDeDados = this.garantirCabecalhoValidoERetornarLinhasDeDados(linhas);

    const { validas, erros } = this.validarLinhas(linhasDeDados);
    const totalProcessado = await this.persistirValidas(validas, erros);

    const nomeArquivoRejeitados = erros.length > 0 ? this.gerarArquivoDeRejeitados(nomeArquivo, erros) : null;

    await this.remessaFinanceiraRepository.create({
      nomeArquivo,
      totalRegistros: linhasDeDados.length,
      totalProcessados: totalProcessado,
      totalRejeitados: erros.length,
    });

    return {
      nomeArquivo,
      totalLido: linhasDeDados.length,
      totalProcessado,
      totalRejeitado: erros.length,
      erros: erros.map(({ linha, motivo }) => ({ linha, motivo })),
      nomeArquivoRejeitados,
    };
  }

  private async garantirRemessaInedita(nomeArquivo: string): Promise<void> {
    const jaRecebida = await this.remessaFinanceiraRepository.existsByNomeArquivo(nomeArquivo);

    if (jaRecebida) {
      throw AppError.conflict(`A remessa "${nomeArquivo}" já foi recebida e processada anteriormente.`);
    }
  }

  // Heurística: Buffer.toString("utf-8") não lança erro em bytes inválidos,
  // ele os substitui por U+FFFD. A presença desse caractere é sinal de que
  // o arquivo não estava de fato em UTF-8 — a mesma causa de rejeição total
  // prevista no contrato ("arquivo ilegível por encoding divergente").
  private garantirEncodingLegivel(conteudo: string): void {
    if (conteudo.includes("�")) {
      throw AppError.unprocessable(
        "Arquivo ilegível: encoding divergente do esperado (UTF-8). Solicite uma nova remessa ao Sistema Financeiro.",
      );
    }
  }

  private garantirCabecalhoValidoERetornarLinhasDeDados(linhas: string[][]): string[][] {
    if (linhas.length === 0) {
      throw AppError.unprocessable("Arquivo vazio: nenhuma linha encontrada.");
    }

    const [cabecalho, ...linhasDeDados] = linhas;
    const cabecalhoValido =
      cabecalho !== undefined &&
      cabecalho.length === LANCAMENTOS_CSV_HEADER.length &&
      cabecalho.every((coluna, indice) => coluna === LANCAMENTOS_CSV_HEADER[indice]);

    if (!cabecalhoValido) {
      throw AppError.unprocessable(
        "Cabeçalho ausente, corrompido ou com delimitador incorreto. Solicite uma nova remessa ao Sistema Financeiro.",
        { cabecalhoEsperado: LANCAMENTOS_CSV_HEADER, cabecalhoRecebido: cabecalho },
      );
    }

    return linhasDeDados;
  }

  private validarLinhas(linhasDeDados: string[][]): {
    validas: Array<{ linha: number; dados: CreateLancamentoData; dadosOriginais: string }>;
    erros: ErroLinha[];
  } {
    const validas: Array<{ linha: number; dados: CreateLancamentoData; dadosOriginais: string }> = [];
    const erros: ErroLinha[] = [];
    const idsVistosNaRemessa = new Set<number>();

    linhasDeDados.forEach((colunas, indice) => {
      // +1 porque `indice` é base 0, +1 porque o cabeçalho ocupou a linha 1.
      const numeroLinha = indice + 2;
      const dadosOriginais = colunas.join(CSV_DELIMITER);

      if (colunas.length !== LANCAMENTOS_CSV_HEADER.length) {
        erros.push({ linha: numeroLinha, motivo: "Quantidade divergente de colunas", dadosOriginais });
        return;
      }

      const resultado = lancamentoRowSchema.safeParse(mapColunasParaLancamento(colunas));

      if (!resultado.success) {
        const motivo = resultado.error.issues.map((issue) => issue.message).join("; ");
        erros.push({ linha: numeroLinha, motivo, dadosOriginais });
        return;
      }

      if (idsVistosNaRemessa.has(resultado.data.idLancamento)) {
        erros.push({
          linha: numeroLinha,
          motivo: "Registro duplicado (id_lancamento repetido nesta remessa)",
          dadosOriginais,
        });
        return;
      }

      idsVistosNaRemessa.add(resultado.data.idLancamento);
      validas.push({ linha: numeroLinha, dados: resultado.data, dadosOriginais });
    });

    return { validas, erros };
  }

  private async persistirValidas(
    validas: Array<{ linha: number; dados: CreateLancamentoData; dadosOriginais: string }>,
    erros: ErroLinha[],
  ): Promise<number> {
    let totalProcessado = 0;

    for (const { linha, dados, dadosOriginais } of validas) {
      const jaExiste = await this.lancamentoRepository.existsById(dados.idLancamento);

      if (jaExiste) {
        erros.push({
          linha,
          motivo: "Lançamento já processado anteriormente (id_lancamento já existe na base)",
          dadosOriginais,
        });
        continue;
      }

      await this.lancamentoRepository.create(dados);
      totalProcessado++;
    }

    return totalProcessado;
  }

  private gerarArquivoDeRejeitados(nomeArquivoOriginal: string, erros: ErroLinha[]): string {
    const nomeArquivoRejeitados = buildNomeArquivoRejeitados(nomeArquivoOriginal);
    const linhasRejeitadas = erros.map((erro) => [String(erro.linha), erro.motivo, erro.dadosOriginais]);

    const conteudoCsv = buildCsvContent(REJEITADOS_CSV_HEADER, linhasRejeitadas, {
      delimiter: CSV_DELIMITER,
      lineBreak: CSV_LINE_BREAK,
    });

    writeCsvFile(path.join(IMPORTS_REJEITADOS_DIR, nomeArquivoRejeitados), conteudoCsv);

    return nomeArquivoRejeitados;
  }
}
