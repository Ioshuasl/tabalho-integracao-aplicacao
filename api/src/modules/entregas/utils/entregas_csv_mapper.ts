import type { Entrega } from "../types/entregas_types";

// Cabeçalho exato exigido pela Seção 2/6 do contrato Grupo7 -> Grupo1.
export const ENTREGAS_CSV_HEADER = [
  "id_entrega",
  "id_pedido",
  "id_cliente",
  "nome_destinatario",
  "transportadora",
  "status_entrega",
  "data_prevista",
  "data_entrega",
  "cidade_destino",
  "uf_destino",
  "valor_frete",
];

export function buildNomeArquivoRemessa(numeroRemessa: number): string {
  const numeroFormatado = String(numeroRemessa).padStart(3, "0");
  return `sistema_entrega_${numeroFormatado}.csv`;
}

function formatarData(data: Date | null): string {
  if (!data) {
    return "";
  }

  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarValorFrete(valor: number): string {
  return valor.toFixed(2);
}

/**
 * Mapeia uma Entrega para a linha CSV do contrato: data_entrega vazia
 * quando não preenchida vira string "" — ao juntar com o delimitador ";"
 * isso resulta nos dois delimitadores consecutivos que o contrato exige.
 */
export function mapEntregaParaLinhaCsv(entrega: Entrega): string[] {
  return [
    String(entrega.id),
    String(entrega.idPedido),
    String(entrega.idCliente),
    entrega.nomeDestinatario,
    entrega.transportadora,
    entrega.statusEntrega,
    formatarData(entrega.dataPrevista),
    formatarData(entrega.dataEntrega),
    entrega.cidadeDestino,
    entrega.ufDestino,
    formatarValorFrete(entrega.valorFrete),
  ];
}
