/*
  Warnings:

  - Added the required column `previousStatus` to the `AssetsHistoric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssetsHistoric" ADD COLUMN     "previousStatus" TEXT NOT NULL;
