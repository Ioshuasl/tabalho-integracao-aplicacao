-- CreateEnum
CREATE TYPE "StatusEntrega" AS ENUM ('PENDENTE', 'EM_TRANSITO', 'ENTREGUE', 'DEVOLVIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "Transportadora" AS ENUM ('CORREIOS', 'JADLOG', 'TOTAL_EXPRESS', 'BRASPRESS', 'LOGGI', 'TRANSPORTADORA_PROPRIA');

-- CreateTable
CREATE TABLE "entregas" (
    "id" SERIAL NOT NULL,
    "idPedido" INTEGER NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "nomeDestinatario" VARCHAR(100) NOT NULL,
    "transportadora" "Transportadora" NOT NULL,
    "statusEntrega" "StatusEntrega" NOT NULL,
    "dataPrevista" DATE NOT NULL,
    "dataEntrega" DATE,
    "cidadeDestino" VARCHAR(60) NOT NULL,
    "ufDestino" CHAR(2) NOT NULL,
    "valorFrete" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remessas" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "geradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "remessas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remessas_numero_key" ON "remessas"("numero");
