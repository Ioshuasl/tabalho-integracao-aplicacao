import { AppError } from "../../../shared/errors/app_error";
import type {
  CreateEntregaData,
  Entrega,
  EntregaFilters,
  EntregaRepository,
  PaginatedResult,
  Pagination,
  UpdateEntregaData,
} from "../types/entregas_types";

export class EntregasService {
  // Depende da interface (porta), não da implementação concreta com
  // Prisma — o EntregasService pode ser testado com um repositório em
  // memória, sem tocar em banco de dados.
  constructor(private readonly entregaRepository: EntregaRepository) {}

  create(data: CreateEntregaData): Promise<Entrega> {
    return this.entregaRepository.create(data);
  }

  async update(id: number, data: UpdateEntregaData): Promise<Entrega> {
    const atualizada = await this.entregaRepository.update(id, data);

    if (!atualizada) {
      throw AppError.notFound(`Entrega ${id} não encontrada`);
    }

    return atualizada;
  }

  async delete(id: number): Promise<void> {
    const removida = await this.entregaRepository.delete(id);

    if (!removida) {
      throw AppError.notFound(`Entrega ${id} não encontrada`);
    }
  }

  async findById(id: number): Promise<Entrega> {
    const entrega = await this.entregaRepository.findById(id);

    if (!entrega) {
      throw AppError.notFound(`Entrega ${id} não encontrada`);
    }

    return entrega;
  }

  findMany(filters: EntregaFilters, pagination: Pagination): Promise<PaginatedResult<Entrega>> {
    return this.entregaRepository.findMany(filters, pagination);
  }
}
