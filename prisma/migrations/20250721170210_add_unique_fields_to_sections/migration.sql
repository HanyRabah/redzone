/*
  Warnings:

  - A unique constraint covering the columns `[page]` on the table `Sections` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[section]` on the table `Sections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `page` to the `Sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sections" ADD COLUMN     "page" TEXT NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sections_page_key" ON "Sections"("page");

-- CreateIndex
CREATE UNIQUE INDEX "Sections_section_key" ON "Sections"("section");
