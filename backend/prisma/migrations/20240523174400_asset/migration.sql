/*
  Warnings:

  - A unique constraint covering the columns `[idClient]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Asset_idClient_key" ON "Asset"("idClient");
