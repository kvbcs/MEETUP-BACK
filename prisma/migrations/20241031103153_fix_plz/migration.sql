-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_agendaId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `agendaId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `Agenda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
