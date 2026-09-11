import type { PrismaClient } from "@prisma/client";
import type { CreateRemessaData, Remessa, RemessaRepository } from "../types/remessa_types";

export class PrismaRemessaRepository implements RemessaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getUltimoNumero(): Promise<number> {
    const ultima = await this.prisma.remessa.findFirst({ orderBy: { numero: "desc" } });
    return ultima?.numero ?? 0;
  }

  create(data: CreateRemessaData): Promise<Remessa> {
    return this.prisma.remessa.create({ data });
  }
}
