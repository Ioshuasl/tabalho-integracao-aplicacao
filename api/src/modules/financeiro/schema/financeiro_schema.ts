import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { parseDataBrasileira } from "../../../shared/utils/data_brasileira";
import { FormaPagamento, StatusLancamento, TipoOperacao } from "../enum/financeiro_enum";
import { isCpfOuCnpjValido } from "../utils/documento_validator";

extendZodWithOpenApi(z);

// Contrato: "valor" tem até 14 dígitos inteiros + 2 decimais.
const VALOR_MAXIMO = 99_999_999_999_999.99;

const dataBrasileiraObrigatoriaSchema = z.string().transform((valor, ctx) => {
  const data = parseDataBrasileira(valor);

  if (!data) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "data inválida (esperado DD/MM/AAAA)" });
    return z.NEVER;
  }

  return data;
});

// Campo opcional do CSV: string vazia vira null; caso contrário precisa
// ser uma data válida no formato DD/MM/AAAA.
const dataBrasileiraOpcionalSchema = z.string().transform((valor, ctx) => {
  if (valor.trim() === "") {
    return null;
  }

  const data = parseDataBrasileira(valor);

  if (!data) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "data inválida (esperado DD/MM/AAAA)" });
    return z.NEVER;
  }

  return data;
});

/**
 * Valida uma linha já quebrada em colunas nomeadas (strings cruas do CSV).
 * Reflete literalmente o dicionário de campos do contrato do Grupo 6
 * (Seção 3) — inclusive não inventando regras que o contrato não define
 * (ex.: eles não proíbem espaços nas bordas de `descricao`, diferente do
 * que definimos no nosso próprio contrato de saída para o Grupo 1).
 */
export const lancamentoRowSchema = z
  .object({
    idLancamento: z.coerce
      .number({ invalid_type_error: "id_lancamento deve ser numérico" })
      .int()
      .positive("id_lancamento deve ser um inteiro positivo"),
    descricao: z
      .string()
      .min(5, "descricao deve ter entre 5 e 150 caracteres")
      .max(150, "descricao deve ter entre 5 e 150 caracteres")
      .refine((valor) => valor.trim().length > 0, "descricao não pode conter apenas espaços em branco"),
    tipoOperacao: z.nativeEnum(TipoOperacao, {
      errorMap: () => ({ message: "tipo_operacao inválido (esperado P ou R)" }),
    }),
    valor: z.coerce
      .number({ invalid_type_error: "valor deve ser numérico (ponto como separador decimal)" })
      .positive("valor deve ser maior que zero")
      .max(VALOR_MAXIMO, "valor excede o máximo de 14 dígitos inteiros")
      .refine((valor) => Number.isInteger(Math.round(valor * 100)), "valor deve ter no máximo 2 casas decimais"),
    dataVencimento: dataBrasileiraObrigatoriaSchema,
    dataPagamento: dataBrasileiraOpcionalSchema,
    status: z.nativeEnum(StatusLancamento, {
      errorMap: () => ({ message: "status inválido (esperado PENDENTE, PAGO ou CANCELADO)" }),
    }),
    formaPagamento: z.nativeEnum(FormaPagamento, {
      errorMap: () => ({
        message: "forma_pagamento inválida (esperado PIX, BOLETO, CARTAO_CREDITO, TRANSFERENCIA ou DINHEIRO)",
      }),
    }),
    documentoTitular: z.string().refine(isCpfOuCnpjValido, "CPF ou CNPJ com dígito verificador inválido"),
  })
  .superRefine((data, ctx) => {
    if (data.status === StatusLancamento.PAGO && !data.dataPagamento) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataPagamento"],
        message: 'Status PAGO sem data de pagamento preenchida',
      });
    }
  });

export type LancamentoRowInput = z.input<typeof lancamentoRowSchema>;
export type LancamentoRowParsed = z.output<typeof lancamentoRowSchema>;

export const importFinanceiroResponseSchema = z
  .object({
    nomeArquivo: z.string(),
    totalLido: z.number().int(),
    totalProcessado: z.number().int(),
    totalRejeitado: z.number().int(),
    erros: z.array(z.object({ linha: z.number().int(), motivo: z.string() })),
    nomeArquivoRejeitados: z.string().nullable(),
  })
  .openapi("RelatorioImportacaoFinanceiro");
