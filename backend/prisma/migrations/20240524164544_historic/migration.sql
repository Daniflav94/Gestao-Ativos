-- DropForeignKey
ALTER TABLE "AssetsHistoric" DROP CONSTRAINT "AssetsHistoric_collaboratorId_fkey";

-- AlterTable
ALTER TABLE "AssetsHistoric" ALTER COLUMN "collaboratorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetsHistoric" ADD CONSTRAINT "AssetsHistoric_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
