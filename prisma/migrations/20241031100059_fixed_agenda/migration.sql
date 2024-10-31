/*
  Warnings:

  - Added the required column `agendaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `agenda` DROP FOREIGN KEY `Agenda_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `agendaId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `Agenda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
