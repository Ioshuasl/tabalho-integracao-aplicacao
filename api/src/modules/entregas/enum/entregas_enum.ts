/**
 * Definidos como objeto const + tipo derivado (não `enum` do TypeScript)
 * de propósito: um `enum` é um tipo nominal e não seria estruturalmente
 * compatível com o union de strings que o Prisma gera para seus próprios
 * enums, exigindo casts em toda fronteira com o repository. Como objeto
 * const, o tipo aqui é um union de strings literais — compatível por
 * estrutura com o Prisma, sem o domínio precisar importar nada do Prisma.
 */
export const StatusEntrega = {
  PENDENTE: "PENDENTE",
  EM_TRANSITO: "EM_TRANSITO",
  ENTREGUE: "ENTREGUE",
  DEVOLVIDA: "DEVOLVIDA",
  CANCELADA: "CANCELADA",
} as const;

export type StatusEntrega = (typeof StatusEntrega)[keyof typeof StatusEntrega];

export const Transportadora = {
  CORREIOS: "CORREIOS",
  JADLOG: "JADLOG",
  TOTAL_EXPRESS: "TOTAL_EXPRESS",
  BRASPRESS: "BRASPRESS",
  LOGGI: "LOGGI",
  TRANSPORTADORA_PROPRIA: "TRANSPORTADORA_PROPRIA",
} as const;

export type Transportadora = (typeof Transportadora)[keyof typeof Transportadora];

export const UFS_VALIDAS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type Uf = (typeof UFS_VALIDAS)[number];
