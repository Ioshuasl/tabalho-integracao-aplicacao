import type { FormaPagamento, StatusLancamento, TipoOperacao } from "../enum/financeiro_enum";

export interface LancamentoFinanceiro {
  idLancamento: number;
  descricao: string;
  tipoOperacao: TipoOperacao;
  valor: number;
  dataVencimento: Date;
  dataPagamento: Date | null;
  status: StatusLancamento;
  formaPagamento: FormaPagamento;
  documentoTitular: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLancamentoData {
  idLancamento: number;
  descricao: string;
  tipoOperacao: TipoOperacao;
  valor: number;
  dataVencimento: Date;
  dataPagamento: Date | null;
  status: StatusLancamento;
  formaPagamento: FormaPagamento;
  documentoTitular: string;
}

/**
 * Porta (Clean Architecture / DIP): o service de importação depende desta
 * interface, nunca da implementação concreta com Prisma.
 */
export interface LancamentoFinanceiroRepository {
  existsById(idLancamento: number): Promise<boolean>;
  create(data: CreateLancamentoData): Promise<LancamentoFinanceiro>;
}
