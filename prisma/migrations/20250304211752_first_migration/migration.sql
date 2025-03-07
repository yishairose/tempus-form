/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `product` ENUM('residential', 'commercial', 'development') NOT NULL,
    `agreement` BOOLEAN NOT NULL,
    `isBroker` BOOLEAN NOT NULL,
    `brokerContactName` VARCHAR(191) NULL,
    `brokerCompanyName` VARCHAR(191) NULL,
    `brokerPhoneNumber` VARCHAR(191) NULL,
    `brokerEmailAddress` VARCHAR(191) NULL,
    `brokerFee` VARCHAR(191) NULL,
    `borrowerCorporateName` VARCHAR(191) NOT NULL,
    `borrowerCompaniesHouse` VARCHAR(191) NOT NULL,
    `borrowerPhoneNumber` VARCHAR(191) NOT NULL,
    `borrowerEmailAddress` VARCHAR(191) NOT NULL,
    `borrowerPropertyExperience` JSON NOT NULL,
    `borrowerAssetsAndLiabilities` JSON NOT NULL,
    `borrowerCreditInfo` VARCHAR(191) NOT NULL,
    `purposeOfFunds` VARCHAR(191) NOT NULL,
    `backgroundStory` VARCHAR(191) NOT NULL,
    `netAmountRequiredDayOne` DOUBLE NOT NULL,
    `netAmountRequiredForWorks` DOUBLE NULL,
    `ltvRequired` VARCHAR(191) NOT NULL,
    `loanTerm` INTEGER NOT NULL,
    `exitStrategy` VARCHAR(191) NOT NULL,
    `currentStatus` VARCHAR(191) NOT NULL,
    `solicitorsDetails` VARCHAR(191) NOT NULL,
    `securities` JSON NOT NULL,
    `additionalDocumentQ1` JSON NULL,
    `consentToCreditSearchQ2` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
