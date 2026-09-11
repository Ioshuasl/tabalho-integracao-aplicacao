# **Contrato de Integração de Aplicações via Arquivo CSV**

**Disciplina:** Integração de Aplicações  
**Domínio / Contexto:** Sistema Financeiro (Lançamentos / Contas a Pagar e Receber)  
**Tipo de Documento:** Especificação Técnica e Contrato de Integração  
**Versão:** 2.0  
**Status:** Aprovado  
**Integrantes da Equipe:** Lucas Freitas, David Oliveira, Ricardo Gabriel e Maria Eduarda Viana  
**E-mail para envio dos arquivos inconsistentes:** lucasfreitasfe2@gmail.com

## **1\. Identificação do Arquivo e Escopo da Integração**

| Item | Especificação Técnica |
| :---- | :---- |
| **Finalidade** | Exportação e integração em lote de títulos financeiros, conciliações e lançamentos de contas a pagar/receber para processamento contábil e liquidação pelo sistema consumidor. |
| **Sistema Produtor** | Sistema Financeiro (Grupo 6\) |
| **Sistema Consumidor** | Sistema de Entregas / Faturamento / ERP Integrado (Cadeia de Integração) |
| **Padrão do Nome do Arquivo** | financeiro\_lancamentos\_\<YYYYMMDD\>\_\<NUMERO\_REMESSA\>.csv |
| **Exemplo de Nome** | financeiro\_lancamentos\_20260904\_001.csv |
| **Extensão Obrigatória** | .csv |
| **Periodicidade / Acionamento** | Por lote (batch) / Fechamento diário / Sob demanda |

Este documento normatiza as interfaces técnicas de entrada e saída de dados financeiros entre as aplicações, estipulando formato de arquivo, tipos de campos, regras de integridade transacional e tratamento de exceções.

## **2\. Especificações Estruturais do Arquivo CSV**

| Parâmetro Estrutural | Definição Contratual | Observações |
| :---- | :---- | :---- |
| **Codificação de Caracteres (Encoding)** | UTF-8 (sem BOM) | Garante compatibilidade total com caracteres acentuados da língua portuguesa em descrições e nomes. |
| **Delimitador de Campos** | Ponto e vírgula (;) | Evita conflito com vírgulas de texto e decimais de valores financeiros. |
| **Caractere de Aspas (Text Qualifier)** | Aspas duplas (") | Obrigatório em campos de texto livre que contenham o delimitador (;) ou quebras de linha. Aspas literais devem ser escapadas como "". |
| **Quebra de Linha (EOL)** | CRLF (\\r\\n) ou LF (\\n) | O parser do sistema consumidor deve tolerar ambas as terminações. |
| **Presença de Cabeçalho** | Sim (Obrigatório na primeira linha) | A linha 1 deve conter exatamente os nomes contratuais das 9 colunas. |
| **Quantidade Exata de Colunas** | 9 colunas por linha | Linhas com quantidade divergente de colunas serão enviadas diretamente ao lote de rejeição. |

A conformidade estrutural é indispensável para a execução do processamento. Desvios globais que impeçam o particionamento do arquivo exigem a rejeição integral do arquivo e nova emissão de remessa.

## **3\. Dicionário de Campos e Regras de Validação**

Cada linha do arquivo CSV de lançamentos financeiros deve seguir estritamente as especificações abaixo:

| Ordem | Nome do Campo | Tipo | Tamanho | Obrigatório | Formato | Regra de Validação | Exemplo |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | id\_lancamento | Inteiro | Até 10 dígitos | Sim | Numérico | Identificador primário único do título/lançamento financeiro. Deve ser um inteiro positivo (\> 0). IDs duplicados na mesma remessa provocam a rejeição das linhas repetidas. | 5012 |
| 2 | descricao | Texto | 5 a 150 caracteres | Sim | Texto livre | Descrição detalhada da operação financeira. Não pode ser nulo nem conter apenas espaços em branco. | Pagamento Fornecedor Alpha |
| 3 | tipo\_operacao | Texto | 1 caractere | Sim | P ou R | Define a natureza da operação financeira. Aceita estritamente: P (Pagar / Débito) ou R (Receber / Crédito). Qualquer outro valor resulta em rejeição. | P |
| 4 | valor | Decimal | Até 14,2 dígitos | Sim | 0.00 | Valor monetário do lançamento com duas casas decimais (ponto como separador decimal). O valor deve ser estritamente maior que zero (\> 0.00). | 1540.75 |
| 5 | data\_vencimento | Data | 10 caracteres | Sim | DD/MM/YYYY | Data gregoriana válida. Bloquear datas inexistentes no calendário (ex: 31/02 ou 29/02 em anos não bissextos). | 15/10/2026 |
| 6 | data\_pagamento | Data | 10 caracteres | Não | DD/MM/YYYY | Data de liquidação financeira. Opcional (vazio se o título estiver em aberto). Quando preenchida, deve ser uma data válida e não pode ser anterior à data de emissão/criação do título. | 14/10/2026 |
| 7 | status | Texto | 7 a 9 caracteres | Sim | Dominio fechado | Aceita exclusivamente os seguintes valores em caixa alta: PENDENTE, PAGO ou CANCELADO. Se status \= PAGO, o campo data\_pagamento torna-se obrigatório. | PENDENTE |
| 8 | forma\_pagamento | Texto | 3 a 20 caracteres | Sim | Dominio fechado | Método de liquidação. Aceita estritamente: PIX, BOLETO, CARTAO\_CREDITO, TRANSFERENCIA ou DINHEIRO. | PIX |
| 9 | documento\_titular | Texto | 11 a 18 caracteres | Sim | CPF ou CNPJ (com ou sem máscara) | CPF (11 dígitos) ou CNPJ (14 dígitos) do pagador/beneficiário. Deve ser verificado contra o cálculo de dígitos verificadores oficiais (módulo 11). | 01234567890 |

## **4\. Formato das Linhas e Exemplo Prático**

A linha 1 do arquivo CSV exportado pelo Sistema Financeiro deve ser obrigatoriamente idêntica ao seguinte cabeçalho:

id\_lancamento;descricao;tipo\_operacao;valor;data\_vencimento;data\_pagamento;status;forma\_pagamento;documento\_titular

Exemplo de bloco de registros válidos para exportação:

id\_lancamento;descricao;tipo\_operacao;valor;data\_vencimento;data\_pagamento;status;forma\_pagamento;documento\_titular  
1001;Recebimento Fatura Vendas \#4412;R;3500.00;10/09/2026;09/09/2026;PAGO;PIX;04588291033  
1002;Serviços de Infraestrutura Cloud;P;850.40;15/09/2026;;PENDENTE;BOLETO;12345678000195  
1003;Licenciamento de Software ERP;P;1200.00;20/09/2026;;PENDENTE;TRANSFERENCIA;98765432000101  
1004;Reembolso Despesa Operacional;P;145.90;05/09/2026;05/09/2026;PAGO;PIX;82347102049  
1005;Venda a Prazo \- Contrato Anual;R;12500.00;30/11/2026;;PENDENTE;BOLETO;55443322000188

## **5\. Política de Tratamento de Inconsistências e Arquivo de Rejeitados**

Para cumprir os requisitos de processamento tolerante a falhas (processamento parcial), o sistema consumidor implementará as seguintes tratativas:

> * **Rejeição Total do Arquivo:** Ocorrência de cabeçalho ausente/corrompido, separador incorreto (ex: arquivo em vírgula em vez de ponto e vírgula), ou arquivo ilegível por encoding divergente. Nesses casos, o processamento é abortado e uma nova remessa deve ser gerada pelo produtor.  
> * **Processamento Parcial de Registros:** Falhas em linhas pontuais não encerram a importação. Lançamentos válidos são persistidos no banco de dados e lançamentos com falhas de validação são direcionados para o arquivo de rejeitados.  
> * **Layout do Arquivo de Rejeitados (erros.csv):** Conforme especificação da disciplina, o arquivo gerado pelo consumidor terá o formato abaixo:

| Coluna | Tipo | Descrição |
| :---- | :---- | :---- |
| linha | Inteiro | Número da linha no arquivo original da remessa onde o erro foi identificado. |
| motivo | Texto | Mensagem descritiva da regra contratual violada. |
| dados | Texto | Linha original completa rejeitada, encapsulada entre aspas duplas. |

Exemplo de erros.csv produzido no processamento:

linha;motivo;dados  
18;Tipo de operacao invalido (esperado P ou R);"18;Taxa Manutencao;X;250.00;10/09/2026;;PENDENTE;PIX;01234567890"  
34;Valor menor ou igual a zero;"34;Ajuste Saldo;P;-50.00;12/09/2026;;PENDENTE;BOLETO;12345678000195"  
52;Status PAGO sem data de pagamento preenchida;"52;Fatura \#992;R;120.00;08/09/2026;;PAGO;CARTAO\_CREDITO;82347102049"  
77;CPF ou CNPJ com digito verificador invalido;"77;Honorarios;P;3000.00;25/09/2026;;PENDENTE;TRANSFERENCIA;11111111111"  
91;Quantidade divergente de colunas;"91;Estorno Parcial;R;200.00;01/09/2026"

## **6\. Relatório de Execução e Fechamento de Remessa**

Ao término de cada importação, o sistema consumidor emitirá o relatório de conferência em console/log, discriminando:

> 1. Arquivo e código de controle de remessa;  
> 2. Total de registros lidos no lote;  
> 3. Total de registros integrados e persistidos no banco de dados;  
> 4. Total de registros rejeitados e exportados para o erros.csv;  
> 5. Quadro discriminado de linhas rejeitadas e seus respectivos motivos.

