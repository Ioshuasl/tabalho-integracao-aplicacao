// Cabeçalho exato exigido pelo contrato do Grupo 6 (Seção 4): ordem e
// grafia precisam bater literalmente para o arquivo ser aceito.
export const LANCAMENTOS_CSV_HEADER = [
  "id_lancamento",
  "descricao",
  "tipo_operacao",
  "valor",
  "data_vencimento",
  "data_pagamento",
  "status",
  "forma_pagamento",
  "documento_titular",
];

export const REJEITADOS_CSV_HEADER = ["linha", "motivo", "dados"];

export interface LancamentoCsvRow {
  idLancamento: string;
  descricao: string;
  tipoOperacao: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string;
  status: string;
  formaPagamento: string;
  documentoTitular: string;
}

/** Mapeia as colunas posicionais do CSV para um objeto nomeado (ainda como strings cruas, antes da validação/coerção do Zod). */
export function mapColunasParaLancamento(colunas: string[]): LancamentoCsvRow {
  return {
    idLancamento: colunas[0] ?? "",
    descricao: colunas[1] ?? "",
    tipoOperacao: colunas[2] ?? "",
    valor: colunas[3] ?? "",
    dataVencimento: colunas[4] ?? "",
    dataPagamento: colunas[5] ?? "",
    status: colunas[6] ?? "",
    formaPagamento: colunas[7] ?? "",
    documentoTitular: colunas[8] ?? "",
  };
}

export function buildNomeArquivoRejeitados(nomeArquivoOriginal: string): string {
  const nomeSemExtensao = nomeArquivoOriginal.replace(/\.csv$/i, "");
  return `${nomeSemExtensao}_rejeitados.csv`;
}
