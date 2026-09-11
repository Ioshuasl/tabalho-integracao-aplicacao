/**
 * Parser de CSV genérico (RFC4180-ish): trata aspas duplas, aspas escapadas
 * ("") e campos com delimitador ou quebra de linha embutidos, tolerando
 * tanto LF quanto CRLF — características exigidas pelos contratos deste
 * trabalho. Processa o conteúdo inteiro caractere a caractere (não faz
 * split por linha primeiro) porque um campo entre aspas pode conter uma
 * quebra de linha real, que não deve ser tratada como fim de linha.
 */
export function parseCsv(content: string, delimiter: string): string[][] {
  const linhas: string[][] = [];
  let linhaAtual: string[] = [];
  let campoAtual = "";
  let dentroDeAspas = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (dentroDeAspas) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          campoAtual += '"';
          i += 2;
          continue;
        }
        dentroDeAspas = false;
        i++;
        continue;
      }
      campoAtual += char;
      i++;
      continue;
    }

    if (char === '"') {
      dentroDeAspas = true;
      i++;
      continue;
    }

    if (char === delimiter) {
      linhaAtual.push(campoAtual);
      campoAtual = "";
      i++;
      continue;
    }

    if (char === "\r") {
      i++;
      continue;
    }

    if (char === "\n") {
      linhaAtual.push(campoAtual);
      linhas.push(linhaAtual);
      campoAtual = "";
      linhaAtual = [];
      i++;
      continue;
    }

    campoAtual += char;
    i++;
  }

  if (campoAtual.length > 0 || linhaAtual.length > 0) {
    linhaAtual.push(campoAtual);
    linhas.push(linhaAtual);
  }

  return linhas;
}
