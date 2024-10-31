/*
  Warnings:

  - Made the column `agendaId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_agendaId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `agendaId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `Agenda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
