# Contrato de Integração CSV

**Sistema Financeiro Grupo 6 → Sistema de Entregas Grupo 7**

*Disciplina: Integração de Aplicações*

*Trabalho prático: Integração de Aplicações por Arquivos CSV*

*Versão do contrato: 1.0     |     Data de elaboração: 11/09/2026*

*Documento-base: "Contrato de Integração CSV - Sistema Financeiro V2" (Grupo 6, versão 2.0, status Aprovado), formalizado aqui especificamente para o par Grupo 6 → Grupo 7.*

# 1. Identificação do Arquivo

* Nome do arquivo: financeiro\_lancamentos\_\<AAAAMMDD\>\_\<NNN\>.csv, em que AAAAMMDD é a data de geração da remessa e NNN é o número de remessa sequencial, com 3 dígitos e zeros à esquerda.

* Exemplo de nome: financeiro\_lancamentos\_20260904\_001.csv

* Extensão: .csv

* Finalidade: exportar títulos financeiros, conciliações e lançamentos de contas a pagar/receber do Sistema Financeiro para processamento e registro pelo Sistema de Entregas.

* Sistema produtor: Sistema Financeiro (Grupo 6).

* Sistema consumidor: Sistema de Entregas (Grupo 7).

* Periodicidade / acionamento: por lote (batch), fechamento diário ou sob demanda.

* Observação de escopo: este documento especifica o fluxo de entrada Financeiro → Entregas. O fluxo de saída (Entregas → Clientes, Grupo 7 → Grupo 1) é objeto do contrato [Contrato_Integracao_CSV_Grupo7_Entregas.md](Contrato_Integracao_CSV_Grupo7_Entregas.md).

# 2. Estrutura do Arquivo

* Cabeçalho: sim. A linha 1 deve conter exatamente os 9 nomes de campo definidos na Seção 3, na mesma ordem e grafia. Cabeçalho ausente, corrompido ou divergente é considerado erro estrutural do arquivo.

* Delimitador: ponto e vírgula ( ; ).

* Caractere de aspas: aspas duplas ( " ), obrigatório em campos de texto livre que contenham o delimitador ou quebra de linha. Aspas literais devem ser escapadas como "".

* Codificação: UTF-8, sem BOM.

* Quebra de linha: CRLF ( \r\n ) ou LF ( \n ) — o parser do Sistema de Entregas deve tolerar ambas as terminações.

* Ordem das colunas: fixa, 9 colunas por linha. Linhas com quantidade de colunas divergente são enviadas diretamente ao arquivo de rejeitados.

* Espaços em branco: nenhum campo deve conter espaços no início ou no final do valor.

# 3. Especificação dos Campos

| Ordem | Nome | Tipo | Tamanho | Obrigatório | Formato | Regra de validação | Exemplo |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | id\_lancamento | Inteiro | até 10 dígitos | Sim | numérico | Chave primária; inteiro maior que zero; único na remessa (duplicados são rejeitados) | 5012 |
| 2 | descricao | Texto | 5 a 150 caracteres | Sim | texto livre | Não pode ser vazio nem conter somente espaços em branco | Pagamento Fornecedor Alpha |
| 3 | tipo\_operacao | Texto | 1 caractere | Sim | um dos valores do domínio | Deve ser um de: P (Pagar/Débito), R (Receber/Crédito), em maiúsculas | P |
| 4 | valor | Decimal | até 14 dígitos + 2 decimais | Sim | 999999999999.99 (ponto decimal, sempre 2 casas) | Deve ser estritamente maior que 0.00, sem separador de milhar | 1540.75 |
| 5 | data\_vencimento | Data | 10 caracteres | Sim | DD/MM/AAAA | Deve ser uma data válida do calendário (bloquear datas inexistentes, ex.: 31/02 ou 29/02 em ano não bissexto) | 15/10/2026 |
| 6 | data\_pagamento | Data | 10 caracteres | Condicional* | DD/MM/AAAA ou vazio | Obrigatório somente se status = PAGO; vazio nos demais casos; quando preenchida, deve ser data válida e não pode ser anterior à data de emissão do título | 14/10/2026 |
| 7 | status | Texto | 7 a 9 caracteres | Sim | um dos valores do domínio | Deve ser um de: PENDENTE, PAGO, CANCELADO, em maiúsculas | PENDENTE |
| 8 | forma\_pagamento | Texto | 3 a 20 caracteres | Sim | um dos valores do domínio | Deve ser um de: PIX, BOLETO, CARTAO\_CREDITO, TRANSFERENCIA, DINHEIRO, em maiúsculas | PIX |
| 9 | documento\_titular | Texto | 11 a 18 caracteres | Sim | CPF (11 dígitos) ou CNPJ (14 dígitos), com ou sem máscara | Deve ter dígito verificador válido (módulo 11) para CPF ou CNPJ | 01234567890 |

*\* data\_pagamento é obrigatório apenas quando status = PAGO; nos demais status, o campo deve ser enviado vazio (dois delimitadores consecutivos).*

# 4. Regras de Negócio Adicionais

* Não deve haver duas linhas com o mesmo id\_lancamento na mesma remessa (chave primária); duplicados são rejeitados individualmente, sem interromper o restante do processamento.

* status = PAGO implica data\_pagamento obrigatoriamente preenchida; caso contrário, o registro é rejeitado.

* valor deve usar ponto como separador decimal, nunca vírgula, nunca separador de milhar, sempre com exatamente 2 casas decimais, e ser estritamente maior que zero.

* documento\_titular deve ser validado quanto ao dígito verificador (módulo 11) de CPF ou CNPJ; falha na validação leva à rejeição do registro.

* A linha de cabeçalho deve corresponder exatamente aos nomes de campo da Seção 3, na mesma ordem e grafia.

* Linhas com quantidade de colunas diferente de 9 são consideradas erro estrutural da linha.

* Rejeição total do arquivo (impedindo qualquer processamento parcial): cabeçalho ausente/corrompido, delimitador incorreto (ex.: arquivo separado por vírgula) ou arquivo ilegível por encoding divergente. Nesses casos o Sistema de Entregas deve solicitar ao Sistema Financeiro a emissão de uma nova remessa em substituição.

# 5. Controle de Remessa

* Cada arquivo enviado é identificado por uma data de geração e um número de remessa sequencial (NNN, 3 dígitos, zeros à esquerda), ambos incluídos no nome do arquivo conforme a Seção 1.

* O Sistema de Entregas deve registrar cada remessa recebida (nome do arquivo, data/hora de recepção e status de processamento) e não deve reprocessar uma remessa já confirmada, evitando duplicidade de lançamentos.

* Caso o Sistema de Entregas receba uma remessa com numeração fora de sequência, a ocorrência deve ser registrada no relatório de processamento, sem impedir o processamento da remessa recebida.

# 6. Exemplo de Registro Válido

Nome do arquivo: financeiro\_lancamentos\_20260904\_001.csv

id\_lancamento;descricao;tipo\_operacao;valor;data\_vencimento;data\_pagamento;status;forma\_pagamento;documento\_titular

1001;Recebimento Fatura Vendas #4412;R;3500.00;10/09/2026;09/09/2026;PAGO;PIX;04588291033

# 7. Observações e Pendências de Alinhamento com o Grupo 6

Os pontos abaixo não alteram o contrato aprovado pelo Grupo 6, mas devem ser esclarecidos com a equipe antes da execução da integração:

* **Consumidor genérico no documento original**: a V2 do Grupo 6 lista o sistema consumidor como "Sistema de Entregas / Faturamento / ERP Integrado (Cadeia de Integração)". Este documento assume, para o par Grupo 6 → Grupo 7, que o consumidor é especificamente o Sistema de Entregas — vale confirmar isso formalmente com o Grupo 6.

* **Ausência de campo de correlação com Entregas**: o dicionário de campos não possui nenhuma coluna que relacione um lançamento financeiro a uma entrega ou pedido específico (não há id\_entrega nem id\_pedido). Sem esse vínculo, o Sistema de Entregas não conseguirá associar um lançamento a uma entrega individual — só poderá tratar os dados como um livro financeiro genérico, sem relação direta com a operação logística.

* **Exemplos de descrição não relacionados a logística**: os exemplos fornecidos ("Serviços de Infraestrutura Cloud", "Licenciamento de Software ERP") são despesas administrativas genéricas, sem relação aparente com frete ou entregas. Vale confirmar com o Grupo 6 se a remessa real conterá especificamente lançamentos de frete/logística ou se será um feed financeiro genérico da empresa — isso definirá como o Sistema de Entregas deve armazenar e apresentar esses dados.

# 8. Histórico de Revisões

| Versão | Data | Descrição | Responsável |
| :---- | :---- | :---- | :---- |
| 1.0 | 11/09/2026 | Formalização do contrato Grupo 6 → Grupo 7 pelo Grupo 7, com base no documento aprovado "Contrato de Integração CSV - Sistema Financeiro V2" do Grupo 6, no template padrão de contratos do grupo, e nas observações da Seção 7 pendentes de confirmação | Grupo 7 – Sistema de Entregas |

# 9. Aprovação das Equipes

Grupo 6 – Sistema Financeiro (Produtor): _________________________________________

Grupo 7 – Sistema de Entregas (Consumidor): _________________________________________
