// Mesmo racional de src/modules/entregas/enum/entregas_enum.ts: objeto
// const + tipo derivado, não `enum` do TypeScript, para ficar
// estruturalmente compatível com o union de strings que o Prisma gera.
export const TipoOperacao = {
  PAGAR: "P",
  RECEBER: "R",
} as const;

export type TipoOperacao = (typeof TipoOperacao)[keyof typeof TipoOperacao];

export const StatusLancamento = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  CANCELADO: "CANCELADO",
} as const;

export type StatusLancamento = (typeof StatusLancamento)[keyof typeof StatusLancamento];

export const FormaPagamento = {
  PIX: "PIX",
  BOLETO: "BOLETO",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  TRANSFERENCIA: "TRANSFERENCIA",
  DINHEIRO: "DINHEIRO",
} as const;

export type FormaPagamento = (typeof FormaPagamento)[keyof typeof FormaPagamento];
