export interface RemessaFinanceiraRecebida {
  id: number;
  nomeArquivo: string;
  totalRegistros: number;
  totalProcessados: number;
  totalRejeitados: number;
  recebidoEm: Date;
}

export interface CreateRemessaFinanceiraData {
  nomeArquivo: string;
  totalRegistros: number;
  totalProcessados: number;
  totalRejeitados: number;
}

/**
 * Porta (Clean Architecture / DIP). Controle de remessas recebidas exigido
 * pela Seção 5 do contrato Grupo6 -> Grupo7: nunca reprocessar um arquivo
 * já confirmado antes.
 */
export interface RemessaFinanceiraRepository {
  existsByNomeArquivo(nomeArquivo: string): Promise<boolean>;
  create(data: CreateRemessaFinanceiraData): Promise<RemessaFinanceiraRecebida>;
}
