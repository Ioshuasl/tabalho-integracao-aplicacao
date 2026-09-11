import { Prisma, type PrismaClient, type Entrega as EntregaModel } from "@prisma/client";
import type {
  CreateEntregaData,
  Entrega,
  EntregaFilters,
  EntregaRepository,
  PaginatedResult,
  Pagination,
  UpdateEntregaData,
} from "../types/entregas_types";
import type { Uf } from "../enum/entregas_enum";

export class PrismaEntregaRepository implements EntregaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateEntregaData): Promise<Entrega> {
    const criada = await this.prisma.entrega.create({ data });
    return this.toDomain(criada);
  }

  async update(id: number, data: UpdateEntregaData): Promise<Entrega | null> {
    try {
      const atualizada = await this.prisma.entrega.update({ where: { id }, data });
      return this.toDomain(atualizada);
    } catch (error) {
      if (this.isRegistroNaoEncontrado(error)) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.entrega.delete({ where: { id } });
      return true;
    } catch (error) {
      if (this.isRegistroNaoEncontrado(error)) {
        return false;
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Entrega | null> {
    const encontrada = await this.prisma.entrega.findUnique({ where: { id } });
    return encontrada ? this.toDomain(encontrada) : null;
  }

  async findMany(filters: EntregaFilters, pagination: Pagination): Promise<PaginatedResult<Entrega>> {
    const where = this.buildWhere(filters);

    const [items, total] = await Promise.all([
      this.prisma.entrega.findMany({
        where,
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { id: "asc" },
      }),
      this.prisma.entrega.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
    };
  }

  async findManyForExport(filters: EntregaFilters): Promise<Entrega[]> {
    const where = this.buildWhere(filters);
    const items = await this.prisma.entrega.findMany({ where, orderBy: { id: "asc" } });
    return items.map((item) => this.toDomain(item));
  }

  private buildWhere(filters: EntregaFilters): Prisma.EntregaWhereInput {
    const temFiltroDeData = Boolean(filters.dataPrevistaInicio || filters.dataPrevistaFim);

    return {
      statusEntrega: filters.statusEntrega,
      ufDestino: filters.ufDestino,
      dataPrevista: temFiltroDeData
        ? {
            gte: filters.dataPrevistaInicio,
            lte: filters.dataPrevistaFim,
          }
        : undefined,
    };
  }

  private isRegistroNaoEncontrado(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  private toDomain(record: EntregaModel): Entrega {
    return {
      id: record.id,
      idPedido: record.idPedido,
      idCliente: record.idCliente,
      nomeDestinatario: record.nomeDestinatario,
      transportadora: record.transportadora,
      statusEntrega: record.statusEntrega,
      dataPrevista: record.dataPrevista,
      dataEntrega: record.dataEntrega,
      cidadeDestino: record.cidadeDestino,
      // ufDestino é `String @db.Char(2)` no Prisma (tipo `string` puro) —
      // o cast é seguro porque só entra no banco o que já passou pelo Zod.
      ufDestino: record.ufDestino as Uf,
      valorFrete: Number(record.valorFrete),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
