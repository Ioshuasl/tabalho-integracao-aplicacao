import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { StatusEntrega, UFS_VALIDAS } from "../enum/entregas_enum";

extendZodWithOpenApi(z);

export const exportEntregasQuerySchema = z.object({
  statusEntrega: z.nativeEnum(StatusEntrega).optional(),
  ufDestino: z.enum(UFS_VALIDAS).optional(),
  dataPrevistaInicio: z.coerce.date().optional(),
  dataPrevistaFim: z.coerce.date().optional(),
});

export type ExportEntregasQuery = z.infer<typeof exportEntregasQuerySchema>;
