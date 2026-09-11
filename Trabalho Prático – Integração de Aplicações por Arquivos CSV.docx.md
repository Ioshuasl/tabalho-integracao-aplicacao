# 

# INTEGRAÇÃO DE APLICAÇÕES POR ARQUIVOS CSV

## 1\. Identificação

**Disciplina:** Integração de Aplicações  
**Modalidade:** Trabalho prático em grupo  
**Tema:** Integração de sistemas utilizando arquivos CSV  
**Forma de integração:** Transferência de arquivos  
**Tecnologias:** Livre escolha do grupo  
**Número de integrantes:** Conforme orientação do professor

---

# 2\. Contextualização

Em ambientes corporativos, é comum que diferentes sistemas precisem trocar informações entre si.

Nem sempre esses sistemas foram desenvolvidos pela mesma equipe, utilizam a mesma linguagem de programação ou possuem o mesmo banco de dados. Por esse motivo, mecanismos de integração são necessários para permitir a comunicação entre aplicações.

Uma das formas mais simples e tradicionais de integração é a **transferência de arquivos**, na qual um sistema produz um arquivo contendo informações que posteriormente será processado por outro sistema.

Entre os formatos utilizados para esse tipo de integração está o **CSV (Comma-Separated Values \- Valores separados por vírgula)**.

Apesar de sua simplicidade, a utilização de arquivos CSV pode gerar diversos problemas de integração. Diferenças na definição dos campos, delimitadores, formatos de datas, valores numéricos, codificação de caracteres e registros inválidos podem fazer com que o sistema consumidor interprete os dados de maneira incorreta.

Neste trabalho, os estudantes deverão desenvolver uma solução de integração baseada na troca de arquivos CSV entre diferentes sistemas.

O principal desafio será demonstrar que **integrar aplicações não significa apenas gerar e ler arquivos, mas estabelecer um contrato de comunicação, validar os dados recebidos e tratar situações inesperadas.**

---

# 3\. Objetivos

Ao final da atividade, o aluno deverá ser capaz de:

* compreender a transferência de arquivos como uma abordagem de integração de aplicações;

* desenvolver uma aplicação capaz de gerar arquivos CSV;

* desenvolver uma aplicação capaz de consumir arquivos CSV;

* definir um contrato de integração entre sistemas;

* especificar campos, tipos e formatos de dados;

* identificar inconsistências em arquivos recebidos;

* validar dados provenientes de outro sistema;

* tratar registros inválidos sem interromper todo o processamento;

* registrar erros ocorridos durante a integração;

* gerar arquivos de rejeição;

* compreender problemas relacionados à interoperabilidade entre aplicações;

* avaliar as vantagens e limitações da integração baseada em arquivos.

---

# 4\. Organização da atividade

A turma será dividida em grupos.

Cada grupo representará uma equipe responsável pelo desenvolvimento de um sistema de informação.

Os grupos serão organizados em uma cadeia de integração.

Por exemplo, considerando sete grupos:

Grupo 1 → Grupo 2  
Grupo 2 → Grupo 3  
Grupo 3 → Grupo 4  
Grupo 4 → Grupo 5  
Grupo 5 → Grupo 6  
Grupo 6 → Grupo 7  
Grupo 7 → Grupo 1

Cada grupo terá, portanto, **dois papéis**:

### Sistema Produtor

Será responsável por:

* produzir os dados;

* gerar o arquivo CSV;

* disponibilizar o arquivo para outro grupo;

* respeitar o contrato de integração estabelecido.

### Sistema Consumidor

Será responsável por:

* receber o arquivo CSV;

* interpretar os dados;

* validar o arquivo;

* processar os registros válidos;

* identificar registros inválidos;

* registrar os erros;

* gerar o arquivo de rejeitados.

Assim, todos os grupos deverão atuar simultaneamente como **produtores e consumidores de dados**.

---

# 5\. Cenário de integração

Cada grupo deverá desenvolver uma aplicação relacionada a um determinado domínio, conforme a distribuição dos seguintes cenários: 

| Grupo | Sistema |
| :---- | :---- |
| Grupo 1 | Sistema de Clientes |
| Grupo 2 | Sistema de Vendas |
| Grupo 3 | Sistema de Produtos |
| Grupo 4 | Sistema de Estoque |
| Grupo 5 | Sistema de Pedidos |
| Grupo 6 | Sistema Financeiro |
| Grupo 7 | Sistema de Entregas |

Os sistemas deverão trocar informações utilizando exclusivamente arquivos CSV durante a integração.

---

# 

# 6\. Arquitetura da solução

A integração deverá seguir, conceitualmente, o seguinte fluxo:

---

# 

# 7\. Contrato de integração

Antes da implementação, os grupos deverão estabelecer um **Contrato de Integração CSV** entre produtor e consumidor.

O contrato deverá ser elaborado conjuntamente pelas duas equipes envolvidas.

O documento deverá especificar, no mínimo:

### 7.1 Identificação do arquivo

* nome do arquivo;

* extensão;

* finalidade;

* sistema produtor;

* sistema consumidor.

### 7.2 Estrutura

* existência ou não de cabeçalho;

* delimitador;

* caractere de aspas;

* codificação;

* quebra de linha;

* ordem das colunas.

### 7.3 Campos

Para cada campo deverão ser definidos:

* nome;

* tipo;

* tamanho, quando aplicável;

* obrigatoriedade;

* formato;

* regra de validação;

* exemplo.

Exemplos 

[https://nfe.prefeitura.sp.gov.br/arquivos/nfe\_layout\_emitidas\_recebidas.pdf](https://nfe.prefeitura.sp.gov.br/arquivos/nfe_layout_emitidas_recebidas.pdf)

[https://support.staffbase.com/hc/en-us/articles/360007108391-CSV-File-Examples](https://support.staffbase.com/hc/en-us/articles/360007108391-CSV-File-Examples)

https://docs.vehub.com.br/Layouts/%F0%9F%92%B3%20SLC%20SEC/Manual/

Por exemplo:

| Campo | Tipo | Obrigatório | Formato | Exp. conteúdo |
| :---- | :---- | :---- | :---- | :---- |
| id\_cliente | Inteiro | Sim | 9999 | 102 |
| nome | Texto | Sim | Livre | João Silva |
| email | Texto | Sim | e-mail | joao@email.com |
| data\_nascimento | Data | Sim | DD/MM/YYYY | 15/03/2000 |
| cidade | Texto | Sim | Livre | Goiânia |
| ativo | Booleano | Sim | S/N | S |

---

# 8\. Arquivo CSV válido

O sistema produtor deverá gerar arquivos CSV contendo dados válidos e inválidos, com no mínimo 177 linhas, incluindo as informações dos integrantes do grupo.

Exemplo:

id\_cliente;nome;email;data\_nascimento;cidade;ativo  
1;João Silva;joao@email.com;15/03/2000;Goiânia;S  
2;Maria Souza;maria@email.com;20/07/1998;Brasília;S  
3;Pedro Santos;pedro@email.com;10/11/2001;São Paulo;N

O arquivo deverá obedecer integralmente ao contrato de integração.

---

# 9\. Arquivo CSV com inconsistências

Além do arquivo válido, o grupo produtor deverá gerar arquivo contendo **problemas de integração propositalmente inseridos**.

O professor definirá as inconsistências que deverão ser utilizadas por cada grupo.

O grupo consumidor **não deverá receber previamente a lista dos problemas inseridos no arquivo**.

Dessa forma, o consumidor deverá analisar o arquivo e identificar as inconsistências com base no contrato de integração.

---

# 10\. Problemas que poderão ser utilizados

Serão enviados email para cada um representante dos grupos. 

---

# 11\. Regras para o sistema consumidor

O sistema consumidor deverá obrigatoriamente realizar as seguintes etapas:

### Etapa 1 – Recepção

Receber o arquivo CSV.

### Etapa 2 – Validação estrutural

Verificar:

* existência do arquivo;

* cabeçalho;

* quantidade de colunas;

* ordem dos campos;

* delimitador;

* formato geral.

### Etapa 3 – Validação dos dados

Verificar:

* campos obrigatórios;

* tipos de dados;

* datas;

* números;

* valores permitidos;

* e-mails;

* duplicidades;

* demais regras definidas no contrato.

### Etapa 4 – Processamento

Os registros válidos deverão ser processados normalmente.

### Etapa 5 – Tratamento de erros

Os registros inválidos não poderão simplesmente provocar a interrupção de todo o processamento.

O sistema deverá registrar os erros encontrados e continuar processando os registros válidos, sempre que tecnicamente possível.

---

# 12\. Relatório de processamento

Ao final da importação, o sistema deverá apresentar um resumo semelhante a:

\====================================  
       PROCESSAMENTO DO CSV  
\====================================

Arquivo: clientes-001.csv

Total de registros: 177

Registros processados: 160  
Registros rejeitados: 17

\------------------------------------  
ERROS ENCONTRADOS  
\------------------------------------

Linha 15:  
Data inválida.

Linha 27:  
Campo obrigatório "email" vazio.

Linha 42:  
Quantidade de campos inválida.

Linha 51:  
Formato de valor inválido.

Linha 64:  
Registro duplicado.

Linha 73:  
E-mail inválido.

Linha 88:  
Formato de data não permitido.

…

…

…

---

# 13\. Arquivo de registros rejeitados

O sistema consumidor deverá gerar um arquivo contendo os registros que não puderam ser processados.

Exemplo:

linha;motivo;dados  
15;Data inválida;"15;João;joao@email.com;32/14/2026"  
27;Email obrigatório;"27;Maria;;20/07/1998"  
42;Quantidade de campos inválida;"42;Pedro;..."

O objetivo é permitir que posteriormente esses registros possam ser corrigidos e processados novamente.

---

# 14\. Processamento parcial

O sistema deverá ser capaz de realizar **processamento parcial do arquivo**.

Por exemplo, se o arquivo possuir 100 registros e 5 estiverem inválidos:

100 registros recebidos  
        ↓  
95 registros válidos → processados  
5 registros inválidos → rejeitados

O sistema **não deverá simplesmente interromper todo o processamento ao encontrar o primeiro erro**, salvo quando o problema impedir a interpretação estrutural do arquivo inteiro.

O grupo deverá justificar situações em que seja necessário rejeitar o arquivo completo e solicitar outro arquivo.

---

# 15\. Responsabilidades do sistema produtor

O sistema produtor deverá:

1. possuir dados para exportação;

2. gerar o arquivo CSV com controle de remessa de envio de arquivo;

3. seguir o contrato de integração;

4. produzir um arquivo válido;

5. produzir dois arquivo contendo: dados válido e as inconsistências determinadas pelo professor;

6. disponibilizar os arquivos para o sistema consumidor;

7. documentar quais inconsistências foram inseridas.

8. Se necessário produzir outro arquivo para substituição de arquivo com erro na estrutura. 

     

A lista das inconsistências inseridas deverá ser entregue ao professor, mas **não deverá ser disponibilizada ao grupo consumidor antes da execução da integração**.

---

# 16\. Responsabilidades do sistema consumidor

O sistema consumidor deverá:

1. receber o arquivo obtendo o controle de remessa de recebimento de arquivo;

2. validar sua estrutura;

3. validar seus dados;

4. processar os registros válidos;

5. rejeitar registros inválidos;

6. registrar os erros;

7. gerar relatório de processamento;

8. gerar arquivo de rejeitados;

9. apresentar os resultados da integração.

---

# 17\. Tecnologias

A linguagem de programação e as bibliotecas utilizadas poderão ser escolhidas pelo grupo, desde que aprovadas pelo professor.

Poderão ser utilizadas, por exemplo:

* Java;

* Python;

* JavaScript/Node.js;

* C\#;

* PHP;

* outras tecnologias previamente autorizadas.

O uso de bibliotecas para leitura e escrita de CSV é permitido.

Entretanto, o grupo deverá ser capaz de explicar:

* como o arquivo é lido;

* como o delimitador é identificado;

* como campos entre aspas são tratados;

* como os dados são convertidos;

* como os erros são identificados;

* como os registros inválidos são armazenados.

---

# 18\. Banco de dados

A utilização de banco de dados é recomendada.

O sistema consumidor poderá, por exemplo:

CSV  
 ↓  
Validação  
 ↓  
Transformação  
 ↓  
Banco de Dados

Os registros considerados válidos deverão ser inseridos ou atualizados no banco de dados de acordo com as regras definidas pelo grupo.

Os registros inválidos não deverão ser inseridos no banco.

---

# 19\. O que deverá ser entregue

Cada grupo deverá entregar:

### 1\. Código-fonte

Código completo do sistema produtor e consumidor.

### 2\. Contrato de integração

Documento contendo a especificação do arquivo CSV.

### 3\. Arquivos CSV válidos

Arquivos produzidos de acordo com o contrato.

### 4\. Arquivos CSV com inconsistências

Arquivos contendo os  problemas definidos pelo professor.

### 5\. Arquivo de registros rejeitados

Gerado pelo sistema consumidor.

### 6\. Relatório de processamento

Demonstrando:

* quantidade de registros recebidos;

* quantidade de registros processados;

* quantidade de registros rejeitados;

* erros encontrados;

* tratamento realizado.

### 7\. Relatório técnico

O relatório deverá explicar a solução desenvolvida e as principais decisões técnicas.

---

# 20\. Demonstração prática

Durante a apresentação, o grupo deverá demonstrar:

### Parte 1 – Produção

Executar o sistema produtor e gerar o arquivo CSV.

### Parte 2 – Transferência

Disponibilizar o arquivo para o grupo consumidor.

### Parte 3 – Consumo

Executar o sistema consumidor.

### Parte 4 – Validação

Demonstrar a identificação das inconsistências.

### Parte 5 – Processamento

Demonstrar que os registros válidos foram processados.

### Parte 6 – Rejeição

Demonstrar a geração do arquivo contendo os registros inválidos.

### Parte 7 – Relatório

Apresentar o resultado final da integração.

---

# 21\. Desafio adicional – Correção e reprocessamento

Como atividade adicional, o professor poderá solicitar que os grupos realizem o seguinte procedimento:

CSV com erro  
     ↓  
Identificação do problema  
     ↓  
Correção  
     ↓  
Novo CSV  
     ↓  
Reprocessamento  
     ↓  
Dados integrados

O grupo deverá demonstrar que um registro anteriormente rejeitado pode ser corrigido e posteriormente processado.

---

# 22\. Questões para discussão

Durante a apresentação, o grupo deverá responder às seguintes questões:

1. Quais foram os principais problemas encontrados durante a integração?  
2. Quais problemas poderiam ter sido evitados com um contrato de integração mais detalhado?  
3. O sistema consumidor deve aceitar automaticamente formatos diferentes daqueles definidos no contrato?  
4. Quando é melhor rejeitar um registro e quando é melhor tentar corrigi-lo automaticamente?  
5. O que deveria acontecer se o arquivo inteiro estiver utilizando um delimitador diferente daquele especificado no contrato?  
6. Como o sistema poderia evitar a duplicação de registros?  
7. Quais problemas poderiam ocorrer se o produtor e o consumidor utilizassem sistemas operacionais ou configurações regionais diferentes?  
8. Quais são as principais vantagens da utilização de CSV para integração?  
9. Quais são as principais limitações dessa abordagem?  
10. Em que situações uma API ou um sistema de mensageria poderia ser mais adequado que a transferência de arquivos CSV?

---

# 23\. Critérios de avaliação

| Critério | Peso |
| :---- | :---: |
| Contrato de integração | 15% |
| Geração do arquivo CSV | 10% |
| Consumo e interpretação do CSV | 15% |
| Validação dos dados | 20% |
| Tratamento das inconsistências | 20% |
| Registro e tratamento dos erros | 10% |
| Relatório e documentação | 5% |
| Apresentação e domínio técnico | 5% |
| **Total** | **100%** |

---

# 24\. Regras importantes

### Regra 1

O sistema produtor e consumidor deverão ser desenvolvidos de forma independente, respeitando o contrato de integração.

### Regra 2

O grupo consumidor não terá acesso antecipado à lista de inconsistências inseridas no arquivo problemático.

### Regra 3

O sistema consumidor deverá tratar adequadamente os erros encontrados.

### Regra 4

Não será suficiente apresentar uma aplicação que apenas leia o arquivo e apresente seus dados.

### Regra 5

O grupo deverá demonstrar como sua aplicação identifica e trata problemas de integração.

### Regra 6

Todas as decisões tomadas sobre o formato e o tratamento dos dados deverão estar documentadas.

---

# 25\. Conceitos de integração que deverão ser observados

Durante o desenvolvimento, os grupos deverão relacionar a implementação aos seguintes conceitos:

* integração por transferência de arquivos;

* sistema produtor;

* sistema consumidor;

* Controle de envio e recebimento de remessa; 

* contrato de integração;

* interoperabilidade;

* formato de dados;

* delimitadores;

* codificação;

* validação;

* transformação de dados;

* tratamento de erros;

* registros rejeitados;

* processamento parcial;

* duplicidade;

* reprocessamento;

* confiabilidade da integração.

---

# 26\. Reflexão final

Ao concluir o trabalho, os estudantes deverão compreender que a utilização de um formato aparentemente simples, como o CSV, não elimina os desafios de integração.

Diferentes sistemas podem interpretar o mesmo arquivo de maneiras diferentes quando não existe uma especificação clara.

Por isso, uma integração eficiente depende não apenas da capacidade de **enviar e receber dados**, mas também da definição de **contratos, regras, validações, tratamento de erros e mecanismos de recuperação**.

**O objetivo deste trabalho não é simplesmente fazer um programa “ler CSV”. O objetivo é simular uma integração real entre sistemas independentes e compreender os problemas que podem surgir quando aplicações diferentes precisam trocar informações.**