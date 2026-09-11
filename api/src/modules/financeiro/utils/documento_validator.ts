function calcularDigitoCpf(base: string, fatorInicial: number): number {
  let fator = fatorInicial;
  let soma = 0;

  for (const digito of base) {
    soma += Number(digito) * fator;
    fator--;
  }

  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

function isCpfValido(digitos: string): boolean {
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  const digito1 = calcularDigitoCpf(digitos.slice(0, 9), 10);
  const digito2 = calcularDigitoCpf(digitos.slice(0, 9) + digito1, 11);

  return digitos === digitos.slice(0, 9) + String(digito1) + String(digito2);
}

function calcularDigitoCnpj(base: string, pesos: number[]): number {
  const soma = pesos.reduce((total, peso, indice) => total + Number(base[indice]) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function isCnpjValido(digitos: string): boolean {
  if (digitos.length !== 14 || /^(\d)\1{13}$/.test(digitos)) {
    return false;
  }

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digito1 = calcularDigitoCnpj(digitos.slice(0, 12), pesos1);

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digito2 = calcularDigitoCnpj(digitos.slice(0, 12) + digito1, pesos2);

  return digitos === digitos.slice(0, 12) + String(digito1) + String(digito2);
}

/**
 * Aceita CPF (11 dígitos) ou CNPJ (14 dígitos), com ou sem máscara, e
 * confere o dígito verificador oficial (módulo 11) — exigência explícita
 * do contrato do Grupo 6 para o campo documento_titular.
 */
export function isCpfOuCnpjValido(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "");

  if (digitos.length === 11) {
    return isCpfValido(digitos);
  }

  if (digitos.length === 14) {
    return isCnpjValido(digitos);
  }

  return false;
}
