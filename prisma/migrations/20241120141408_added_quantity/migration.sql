/*
  Warnings:

  - You are about to alter the column `startDate` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `name` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(5)`.
  - Added the required column `quantity` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `image` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `quantity` INTEGER NOT NULL,
    MODIFY `image` TEXT NOT NULL,
    MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL,
    MODIFY `price` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `role` MODIFY `name` VARCHAR(5) NOT NULL;
