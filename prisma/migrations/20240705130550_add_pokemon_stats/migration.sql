/*
  Warnings:

  - You are about to drop the column `type` on the `Pokemon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[statsId]` on the table `UserPokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catchRate` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderRatio` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `UserPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PokemonType" AS ENUM ('NORMAL', 'FIRE', 'WATER', 'ELECTRIC', 'GRASS', 'ICE', 'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'GHOST', 'DRAGON', 'DARK', 'STEEL', 'FAIRY');

-- CreateEnum
CREATE TYPE "MoveCategory" AS ENUM ('PHYSICAL', 'ELEMENTAL', 'ENERGY', 'ADAPTABLE');

-- CreateEnum
CREATE TYPE "StorageStatus" AS ENUM ('WITH_TRAINER', 'IN_POKEBANK');

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "type",
ADD COLUMN     "catchRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "genderRatio" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "types" "PokemonType"[];

-- AlterTable
ALTER TABLE "UserPokemon" ADD COLUMN     "statsId" INTEGER,
ADD COLUMN     "status" "StorageStatus" NOT NULL;

-- CreateTable
CREATE TABLE "BaseStats" (
    "id" SERIAL NOT NULL,
    "phyAtk" INTEGER NOT NULL,
    "eleAtk" INTEGER NOT NULL,
    "eneAtk" INTEGER NOT NULL,
    "adaAtk" INTEGER NOT NULL,
    "phyDef" INTEGER NOT NULL,
    "eleDef" INTEGER NOT NULL,
    "eneDef" INTEGER NOT NULL,
    "adaDef" INTEGER NOT NULL,
    "spd" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "mor" INTEGER NOT NULL,
    "aff" INTEGER NOT NULL,
    "foc" INTEGER NOT NULL,
    "aur" INTEGER NOT NULL,
    "inst" INTEGER NOT NULL,
    "syn" INTEGER NOT NULL,
    "critRate" INTEGER NOT NULL,
    "critMult" DOUBLE PRECISION NOT NULL,
    "elemMult" DOUBLE PRECISION NOT NULL,
    "acc" INTEGER NOT NULL,
    "toughness" INTEGER NOT NULL,
    "pierce" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "BaseStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "phyAtk" INTEGER NOT NULL,
    "eleAtk" INTEGER NOT NULL,
    "eneAtk" INTEGER NOT NULL,
    "adaAtk" INTEGER NOT NULL,
    "phyDef" INTEGER NOT NULL,
    "eleDef" INTEGER NOT NULL,
    "eneDef" INTEGER NOT NULL,
    "adaDef" INTEGER NOT NULL,
    "spd" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "mor" INTEGER NOT NULL,
    "aff" INTEGER NOT NULL,
    "foc" INTEGER NOT NULL,
    "aur" INTEGER NOT NULL,
    "inst" INTEGER NOT NULL,
    "syn" INTEGER NOT NULL,
    "critRate" INTEGER NOT NULL,
    "critMult" DOUBLE PRECISION NOT NULL,
    "elemMult" DOUBLE PRECISION NOT NULL,
    "acc" INTEGER NOT NULL,
    "toughness" INTEGER NOT NULL,
    "pierce" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PokemonType" NOT NULL,
    "category" "MoveCategory" NOT NULL,
    "power" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "pokemonId" INTEGER,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WildPokemon" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "statsId" INTEGER,

    CONSTRAINT "WildPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaseStats_pokemonId_key" ON "BaseStats"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "WildPokemon_statsId_key" ON "WildPokemon"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPokemon_statsId_key" ON "UserPokemon"("statsId");

-- AddForeignKey
ALTER TABLE "BaseStats" ADD CONSTRAINT "BaseStats_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPokemon" ADD CONSTRAINT "UserPokemon_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WildPokemon" ADD CONSTRAINT "WildPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WildPokemon" ADD CONSTRAINT "WildPokemon_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
