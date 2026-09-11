export interface Remessa {
  id: number;
  numero: number;
  nomeArquivo: string;
  totalRegistros: number;
  geradoEm: Date;
}

export interface CreateRemessaData {
  numero: number;
  nomeArquivo: string;
  totalRegistros: number;
}

/**
 * Porta (Clean Architecture / DIP), assim como EntregaRepository —
 * responsabilidade separada porque numeração de remessa é uma regra
 * própria (Seção 5 do contrato), independente do CRUD de entregas.
 */
export interface RemessaRepository {
  getUltimoNumero(): Promise<number>;
  create(data: CreateRemessaData): Promise<Remessa>;
}
