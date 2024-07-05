-- CreateTable
CREATE TABLE "Sprite" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "context" TEXT,

    CONSTRAINT "Sprite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sprite" ADD CONSTRAINT "Sprite_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
