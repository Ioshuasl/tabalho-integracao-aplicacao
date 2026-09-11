import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { StatusEntrega, Transportadora, UFS_VALIDAS } from "../enum/entregas_enum";

extendZodWithOpenApi(z);

// Contrato: valor_frete tem até 8 dígitos inteiros + 2 decimais.
const VALOR_FRETE_MAXIMO = 99_999_999.99;

const naoTemEspacosNasBordas = (valor: string): boolean => valor === valor.trim();

const nomeDestinatarioSchema = z
  .string()
  .min(1, "nomeDestinatario não pode ser vazio")
  .max(100, "nomeDestinatario deve ter no máximo 100 caracteres")
  .refine(naoTemEspacosNasBordas, {
    message: "nomeDestinatario não pode conter espaços no início ou no final",
  });

const cidadeDestinoSchema = z
  .string()
  .min(1, "cidadeDestino não pode ser vazio")
  .max(60, "cidadeDestino deve ter no máximo 60 caracteres")
  .refine(naoTemEspacosNasBordas, {
    message: "cidadeDestino não pode conter espaços no início ou no final",
  });

const valorFreteSchema = z
  .number()
  .min(0, "valorFrete deve ser maior ou igual a 0.00")
  .max(VALOR_FRETE_MAXIMO, "valorFrete deve ter no máximo 8 dígitos inteiros")
  .refine((valor) => Number.isInteger(Math.round(valor * 100)), {
    message: "valorFrete deve ter no máximo 2 casas decimais",
  });

const entregaBodySchema = z
  .object({
    idPedido: z.number().int().positive(),
    idCliente: z.number().int().positive(),
    nomeDestinatario: nomeDestinatarioSchema,
    transportadora: z.nativeEnum(Transportadora),
    statusEntrega: z.nativeEnum(StatusEntrega),
    dataPrevista: z.coerce.date(),
    dataEntrega: z.coerce.date().nullable(),
    cidadeDestino: cidadeDestinoSchema,
    ufDestino: z.enum(UFS_VALIDAS),
    valorFrete: valorFreteSchema,
  })
  .superRefine((data, ctx) => {
    const exigeDataEntrega = data.statusEntrega === StatusEntrega.ENTREGUE;

    if (exigeDataEntrega && !data.dataEntrega) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataEntrega"],
        message: 'dataEntrega é obrigatória quando statusEntrega for "ENTREGUE"',
      });
      return;
    }

    if (!exigeDataEntrega && data.dataEntrega) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataEntrega"],
        message: 'dataEntrega deve ser nula quando statusEntrega não for "ENTREGUE"',
      });
      return;
    }

    if (data.dataEntrega) {
      const limiteMinimo = new Date(data.dataPrevista);
      limiteMinimo.setUTCDate(limiteMinimo.getUTCDate() - 5);

      if (data.dataEntrega < limiteMinimo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dataEntrega"],
          message: "dataEntrega não pode ser anterior a (dataPrevista - 5 dias)",
        });
      }

      if (data.dataEntrega > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dataEntrega"],
          message: "dataEntrega não pode ser posterior à data de processamento",
        });
      }
    }
  });

// create e update usam o mesmo formato de corpo porque a atualização é via
// PUT (substituição completa do recurso), não PATCH parcial.
export const createEntregaBodySchema = entregaBodySchema.openapi("CriarEntrega");
export const updateEntregaBodySchema = entregaBodySchema.openapi("AtualizarEntrega");

// Schema só para documentação da resposta: datas aqui são strings ISO,
// pois é isso que trafega de fato no JSON (res.json serializa Date -> string).
export const entregaResponseSchema = z
  .object({
    id: z.number().int(),
    idPedido: z.number().int(),
    idCliente: z.number().int(),
    nomeDestinatario: z.string(),
    transportadora: z.nativeEnum(Transportadora),
    statusEntrega: z.nativeEnum(StatusEntrega),
    dataPrevista: z.string(),
    dataEntrega: z.string().nullable(),
    cidadeDestino: z.string(),
    ufDestino: z.enum(UFS_VALIDAS),
    valorFrete: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Entrega");

export const entregaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listEntregasQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  statusEntrega: z.nativeEnum(StatusEntrega).optional(),
  ufDestino: z.enum(UFS_VALIDAS).optional(),
  dataPrevistaInicio: z.coerce.date().optional(),
  dataPrevistaFim: z.coerce.date().optional(),
});

export type CreateEntregaBody = z.infer<typeof createEntregaBodySchema>;
export type UpdateEntregaBody = z.infer<typeof updateEntregaBodySchema>;
export type EntregaParams = z.infer<typeof entregaParamsSchema>;
export type ListEntregasQuery = z.infer<typeof listEntregasQuerySchema>;
