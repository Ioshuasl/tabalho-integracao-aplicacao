-- CreateEnum
CREATE TYPE "TipoOperacao" AS ENUM ('P', 'R');

-- CreateEnum
CREATE TYPE "StatusLancamento" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('PIX', 'BOLETO', 'CARTAO_CREDITO', 'TRANSFERENCIA', 'DINHEIRO');

-- CreateTable
CREATE TABLE "lancamentos_financeiros" (
    "idLancamento" INTEGER NOT NULL,
    "descricao" VARCHAR(150) NOT NULL,
    "tipoOperacao" "TipoOperacao" NOT NULL,
    "valor" DECIMAL(16,2) NOT NULL,
    "dataVencimento" DATE NOT NULL,
    "dataPagamento" DATE,
    "status" "StatusLancamento" NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "documentoTitular" VARCHAR(18) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamentos_financeiros_pkey" PRIMARY KEY ("idLancamento")
);

-- CreateTable
CREATE TABLE "remessas_financeiras_recebidas" (
    "id" SERIAL NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "totalProcessados" INTEGER NOT NULL,
    "totalRejeitados" INTEGER NOT NULL,
    "recebidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "remessas_financeiras_recebidas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remessas_financeiras_recebidas_nomeArquivo_key" ON "remessas_financeiras_recebidas"("nomeArquivo");
