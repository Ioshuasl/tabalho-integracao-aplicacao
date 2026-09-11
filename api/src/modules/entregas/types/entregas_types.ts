import type { StatusEntrega, Transportadora, Uf } from "../enum/entregas_enum";

export interface Entrega {
  id: number;
  idPedido: number;
  idCliente: number;
  nomeDestinatario: string;
  transportadora: Transportadora;
  statusEntrega: StatusEntrega;
  dataPrevista: Date;
  dataEntrega: Date | null;
  cidadeDestino: string;
  ufDestino: Uf;
  valorFrete: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntregaData {
  idPedido: number;
  idCliente: number;
  nomeDestinatario: string;
  transportadora: Transportadora;
  statusEntrega: StatusEntrega;
  dataPrevista: Date;
  dataEntrega: Date | null;
  cidadeDestino: string;
  ufDestino: Uf;
  valorFrete: number;
}

// PUT substitui o recurso por completo (sem merge parcial), por isso o
// payload de atualização tem exatamente o mesmo formato da criação.
export type UpdateEntregaData = CreateEntregaData;

export interface EntregaFilters {
  statusEntrega?: StatusEntrega;
  ufDestino?: Uf;
  dataPrevistaInicio?: Date;
  dataPrevistaFim?: Date;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Porta (Clean Architecture / DIP): o service depende desta interface,
 * nunca da implementação concreta com Prisma. A camada de regra de
 * negócio não conhece o ORM usado para persistir os dados.
 */
export interface EntregaRepository {
  create(data: CreateEntregaData): Promise<Entrega>;
  update(id: number, data: UpdateEntregaData): Promise<Entrega | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Entrega | null>;
  findMany(filters: EntregaFilters, pagination: Pagination): Promise<PaginatedResult<Entrega>>;
  findManyForExport(filters: EntregaFilters): Promise<Entrega[]>;
}
