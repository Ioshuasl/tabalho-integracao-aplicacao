# Contrato de Integração CSV

**Sistema de Entregas Grupo 7 → Sistema de Clientes Grupo 1**

*Disciplina: Integração de Aplicações*

*Trabalho prático: Integração de Aplicações por Arquivos CSV*

*Versão do contrato: 1.1     |     Data de elaboração: 04/09/2026     |     Última revisão: 11/09/2026*

# 1\. Identificação do Arquivo

* Nome do arquivo: sistema\_entrega\_NNN.csv, em que NNN é o número de remessa sequencial, com 3 dígitos e zeros à esquerda (ex.: 001, 002, ..., 010).

* Extensão: .csv

* Finalidade: informar ao Sistema de Clientes o status atualizado das entregas associadas aos pedidos de cada cliente, permitindo o acompanhamento pela equipe de atendimento.

* Sistema produtor: Sistema de Entregas (Grupo 7).

* Sistema consumidor: Sistema de Clientes (Grupo 1).

* Observação de escopo: este documento especifica somente o fluxo de saída Entregas → Clientes. O fluxo de entrada (Financeiro → Entregas, Grupo 6 → Grupo 7) é objeto de um contrato de integração independente.

# 2\. Estrutura do Arquivo

* Cabeçalho: sim. A linha de cabeçalho deve conter exatamente os 11 nomes de campo definidos na Seção 3, na mesma ordem e grafia (case sensitive). Cabeçalho ausente, com nomes divergentes ou fora de ordem é considerado erro estrutural do arquivo.

* Delimitador: ponto e vírgula ( ; ).

* Caractere de aspas: aspas duplas ( " ), usado somente quando o valor do campo contiver o delimitador ou uma quebra de linha.

* Codificação: UTF-8, sem BOM.

* Quebra de linha: LF ( \\n ).

* Ordem das colunas: fixa

* Espaços em branco: nenhum campo deve conter espaços no início ou no final do valor. Campo com espaços indevidos é considerado erro de validação de dados (Etapa 3), não erro estrutural.

# 3\. Especificação dos Campos

| Nome | Tipo | Tamanho | Obrigatório | Formato | Regra de validação | Exemplo |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| id\_entrega | Inteiro | até 6 dígitos | Sim | numérico, sem separadores | Chave primária; único no arquivo; maior que zero | 70004 |
| id\_pedido | Inteiro | até 6 dígitos | Sim | numérico, sem separadores | Deve ser numérico e maior que zero. A integridade referencial com o Sistema de Pedidos (Grupo 5\) é de responsabilidade interna do Sistema de Entregas antes da geração do arquivo — o Sistema de Clientes (consumidor) não tem acesso ao Sistema de Pedidos e, portanto, valida somente o formato do campo, não sua existência\*\* | 57360 |
| id\_cliente | Inteiro | até 6 dígitos | Sim | numérico, sem separadores | Deve ser numérico e maior que zero, e deve referenciar um cliente existente na base do próprio Sistema de Clientes (consumidor) — única validação de existência que o consumidor é capaz de realizar, por ser dono desse dado | 1302 |
| nome\_destinatario | Texto | até 100 caracteres | Sim | texto livre | Não pode ser vazio | Ana Souza |
| transportadora | Texto | até 50 caracteres | Sim | um dos valores do domínio | Deve ser uma de: CORREIOS, JADLOG, TOTAL\_EXPRESS, BRASPRESS, LOGGI, TRANSPORTADORA\_PROPRIA (case sensitive, em maiúsculas) | CORREIOS |
| status\_entrega | Texto | fixo | Sim | um dos valores do domínio | Deve ser um de: PENDENTE, EM\_TRANSITO, ENTREGUE, DEVOLVIDA, CANCELADA (case sensitive, em maiúsculas) | ENTREGUE |
| data\_prevista | Data | 10 caracteres | Sim | DD/MM/AAAA | Deve ser uma data válida do calendário | 21/07/2026 |
| data\_entrega | Data | 10 caracteres | Condicional\* | DD/MM/AAAA ou vazio | Obrigatório somente se status\_entrega \= ENTREGUE; vazio nos demais casos; se preenchida, não pode ser anterior a (data\_prevista − 5 dias) nem posterior à data de processamento do arquivo | 22/07/2026 |
| cidade\_destino | Texto | até 60 caracteres | Sim | texto livre | Não pode ser vazio | Porto Alegre |
| uf\_destino | Texto | 2 caracteres | Sim | sigla de UF, maiúscula | Deve ser uma das 27 UFs brasileiras válidas, em maiúsculas (case sensitive) | RS |
| valor\_frete | Decimal | até 8 dígitos \+ 2 decimais | Sim | 99999999.99 (ponto decimal, sempre 2 casas) | Deve ser maior ou igual a 0.00, sem separador de milhar, com exatamente 2 casas decimais | 37.12 |

*\* data\_entrega é obrigatório apenas quando status\_entrega \= ENTREGUE; nos demais status, o campo deve ser enviado vazio (dois delimitadores consecutivos).*

*\*\* Distinção importante: `id_cliente` é validável quanto à existência pelo consumidor (Sistema de Clientes), pois ele é o dono desse dado. `id_pedido` não é — o Sistema de Clientes não tem acesso ao Sistema de Pedidos (Grupo 5), que não está na cadeia direta de integração do Grupo 7\. Por isso, a validação de existência de `id_pedido` fica restrita ao Sistema de Entregas, antes do envio do arquivo.*

# 4\. Regras de Negócio Adicionais

* Não deve haver duas linhas com o mesmo id\_entrega no mesmo arquivo (chave primária).

* id\_pedido deve ser numérico e maior que zero; a verificação de existência desse pedido é responsabilidade interna do Sistema de Entregas antes da geração do arquivo, pois o Sistema de Clientes não tem acesso ao Sistema de Pedidos.

* id\_cliente deve ser numérico, maior que zero, e deve existir na base do Sistema de Clientes — esta é a única validação de existência que o consumidor pode e deve executar.

* transportadora deve pertencer exatamente ao domínio definido na Seção 3 (case sensitive, em maiúsculas).

* status\_entrega deve pertencer exatamente ao domínio definido (case sensitive, em maiúsculas).

* uf\_destino deve pertencer às 27 UFs brasileiras válidas, sempre em maiúsculas (case sensitive).

* valor\_frete deve usar ponto como separador decimal, nunca vírgula, nunca separador de milhar, sempre com exatamente 2 casas decimais, e nunca ser negativo.

* data_entrega, quando preenchida, não pode ser anterior a (data\_prevista − 5 dias) nem posterior à data de processamento do arquivo.

* Nenhum campo pode conter espaços em branco no início ou no final do valor.

* A linha de cabeçalho deve corresponder exatamente aos nomes de campo da Seção 3, na mesma ordem e grafia.

* Linhas com quantidade de colunas diferente de 11 são consideradas erro estrutural da linha.

# 5\. Controle de Remessa

* Cada arquivo enviado é identificado por um número de remessa sequencial (NNN), com 3 dígitos e zeros à esquerda, incluído no próprio nome do arquivo conforme definido na Seção 1 (ex.: sistema\_entrega\_001.csv).

* A numeração é sequencial e crescente por envio do Sistema de Entregas ao Sistema de Clientes, sem reinício de contagem.

* O Sistema de Clientes deve registrar o número de remessa recebido (data/hora de recepção e status de processamento) e não deve reprocessar uma remessa já confirmada, evitando duplicidade de dados.

* Caso o Sistema de Clientes receba uma remessa com número fora de sequência (ex.: recebeu 003 sem ter recebido 002), a ocorrência deve ser registrada no relatório de processamento, mas não impede o processamento da remessa recebida.

# 6\. Exemplo de Registro Válido

Nome do arquivo: sistema\_entrega\_001.csv

id\_entrega;id\_pedido;id\_cliente;nome\_destinatario;transportadora;status\_entrega;data\_prevista;data\_entrega;cidade\_destino;uf\_destino;valor\_frete

70004;57360;1302;Ana Souza;CORREIOS;ENTREGUE;21/07/2026;22/07/2026;Porto Alegre;RS;37.12

# 7\. Histórico de Revisões

| Versão | Data | Descrição | Responsável |
| :---- | :---- | :---- | :---- |
| 1.0 | 04/09/2026 | Versão inicial do contrato, elaborada pelo Grupo 7 para envio ao Grupo 1 | Grupo 7 – Sistema de Entregas |
| 1.1 | 11/09/2026 | Revisão: (1) padronizado nome do arquivo com número de remessa (sistema\_entrega\_NNN.csv), resolvendo contradição com a Seção 5; (2) redefinida responsabilidade de validação de id\_pedido (não verificável pelo consumidor) e id\_cliente (verificável pelo consumidor); (3) definido domínio fechado de transportadoras válidas; (4) adicionada exigência de maiúsculas para uf\_destino; (5) corrigido exemplo de formato de valor\_frete e exigidas exatamente 2 casas decimais; (6) adicionada regra de data\_entrega não posterior à data de processamento; (7) adicionada exigência de cabeçalho exato; (8) adicionada regra de proibição de espaços em branco nas bordas dos campos; (9) detalhado controle de remessa (sequência, registro de recepção, remessa fora de ordem) | Grupo 7 – Sistema de Entregas |

# 8\. Aprovação das Equipes

Grupo 7 – Sistema de Entregas (Produtor): \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Grupo 1 – Sistema de Clientes (Consumidor): \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_