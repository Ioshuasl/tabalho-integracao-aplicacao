const FORMATO_DATA_BR = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/**
 * Faz o parse de uma data no formato DD/MM/AAAA usado pelos contratos CSV
 * deste trabalho. `new Date("31/02/2026")` não serve: o construtor nativo
 * não entende esse formato de forma confiável entre runtimes. Aqui,
 * construímos a data em UTC e conferimos se dia/mês/ano "voltaram"
 * exatamente como enviados — se o JS rolou a data (ex.: 31/02 -> 03/03),
 * a comparação falha e detectamos a data de calendário inválida.
 */
export function parseDataBrasileira(valor: string): Date | null {
  const match = FORMATO_DATA_BR.exec(valor);
  if (!match) {
    return null;
  }

  const [, diaStr, mesStr, anoStr] = match;
  const dia = Number(diaStr);
  const mes = Number(mesStr);
  const ano = Number(anoStr);

  const data = new Date(Date.UTC(ano, mes - 1, dia));

  const dataValida = data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;

  return dataValida ? data : null;
}
