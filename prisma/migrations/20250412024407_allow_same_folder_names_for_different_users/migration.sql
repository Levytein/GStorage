/*
  Warnings:

  - You are about to drop the column `content` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filepath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_authorId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderID_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Folder_name_key";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "content",
DROP COLUMN "published",
DROP COLUMN "updatedAt",
ADD COLUMN     "filepath" TEXT NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "folderID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentId" INTEGER,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "bio",
DROP COLUMN "userId",
ADD COLUMN     "username" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_ownerId_key" ON "Folder"("name", "ownerId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderID_fkey" FOREIGN KEY ("folderID") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
