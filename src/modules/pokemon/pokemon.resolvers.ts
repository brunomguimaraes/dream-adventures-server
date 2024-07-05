import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pokemonResolvers = {
  Query: {
    pokemons: async () => await prisma.pokemon.findMany(),
    userPokemons: async (_: any, { userId }: any) => {
      return await prisma.userPokemon.findMany({
        where: { userId },
        include: { pokemon: true },
      });
    },
  },
  Mutation: {
    createPokemon: async (_: any, { name, type }: any) => {
      return await prisma.pokemon.create({
        data: { name, type },
      });
    },
    catchPokemon: async (_: any, { userId, pokemonId }: any) => {
      return await prisma.userPokemon.create({
        data: { userId, pokemonId },
      });
    },
  },
};
