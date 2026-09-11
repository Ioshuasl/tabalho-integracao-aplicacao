import type { PrismaClient } from "@prisma/client";
import type {
  CreateLancamentoData,
  LancamentoFinanceiro,
  LancamentoFinanceiroRepository,
} from "../types/financeiro_types";

export class PrismaLancamentoFinanceiroRepository implements LancamentoFinanceiroRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsById(idLancamento: number): Promise<boolean> {
    const encontrado = await this.prisma.lancamentoFinanceiro.findUnique({
      where: { idLancamento },
      select: { idLancamento: true },
    });
    return encontrado !== null;
  }

  async create(data: CreateLancamentoData): Promise<LancamentoFinanceiro> {
    const criado = await this.prisma.lancamentoFinanceiro.create({ data });

    return {
      idLancamento: criado.idLancamento,
      descricao: criado.descricao,
      tipoOperacao: criado.tipoOperacao,
      valor: Number(criado.valor),
      dataVencimento: criado.dataVencimento,
      dataPagamento: criado.dataPagamento,
      status: criado.status,
      formaPagamento: criado.formaPagamento,
      documentoTitular: criado.documentoTitular,
      createdAt: criado.createdAt,
      updatedAt: criado.updatedAt,
    };
  }
}
