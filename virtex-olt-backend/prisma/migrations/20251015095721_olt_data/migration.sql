-- CreateTable
CREATE TABLE "olt_data" (
    "id" SERIAL NOT NULL,
    "slot" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "ont" TEXT NOT NULL,
    "sn" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olt_data_pkey" PRIMARY KEY ("id")
);
