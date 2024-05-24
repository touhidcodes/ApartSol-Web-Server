/*
  Warnings:

  - You are about to drop the column `utilitiesDescription` on the `flats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amenities` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_role_key";

-- AlterTable
ALTER TABLE "flats" DROP COLUMN "utilitiesDescription",
ADD COLUMN     "amenities" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
