import type { PrismaClient } from "@prisma/client";
import type {
  CreateRemessaFinanceiraData,
  RemessaFinanceiraRecebida,
  RemessaFinanceiraRepository,
} from "../types/remessa_financeira_types";

export class PrismaRemessaFinanceiraRepository implements RemessaFinanceiraRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsByNomeArquivo(nomeArquivo: string): Promise<boolean> {
    const encontrada = await this.prisma.remessaFinanceiraRecebida.findUnique({
      where: { nomeArquivo },
      select: { id: true },
    });
    return encontrada !== null;
  }

  create(data: CreateRemessaFinanceiraData): Promise<RemessaFinanceiraRecebida> {
    return this.prisma.remessaFinanceiraRecebida.create({ data });
  }
}
