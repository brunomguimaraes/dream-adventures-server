import { calculateStatsForLevel } from '@game/math/stats';
import { PrismaClient } from '@prisma/client';
// import { uploadSpriteToFirebase } from './uploadSprite';

const prisma = new PrismaClient();

export const pokemonResolvers = {
  Query: {
    pokemons: async () =>
      await prisma.pokemon.findMany({
        include: {
          baseStats: true,
          moves: true,
          sprites: true,
          userPokemon: true,
          wildPokemon: true,
        },
      }),
    userPokemons: async (_: any, { userId }: any) => {
      return await prisma.userPokemon.findMany({
        where: { userId },
        include: {
          pokemon: {
            include: {
              baseStats: true,
              moves: true,
              sprites: true,
            },
          },
          stats: true,
        },
      });
    },
    wildPokemons: async () =>
      await prisma.wildPokemon.findMany({
        include: {
          pokemon: {
            include: {
              baseStats: true,
              moves: true,
              sprites: true,
            },
          },
          stats: true,
        },
      }),
    moves: async () => await prisma.move.findMany(),
  },
  Mutation: {
    createPokemon: async (
      _: any,
      { name, types, catchRate, genderRatio, baseStats }: any,
    ) => {
      try {
        const newPokemon = await prisma.pokemon.create({
          data: {
            name,
            types,
            catchRate,
            genderRatio,
            baseStats: {
              create: { ...baseStats },
            },
          },
          // The include statement is not strictly necessary for the creation of the Pokemon,
          // but it is used to ensure that the created Pokemon object returned by the prisma.pokemon.create function
          // includes the related baseStats data. This is useful if you need to have the complete Pokemon object,
          // including its base stats, immediately available after creation.
          // Without the include statement, the returned Pokemon object will not automatically
          // contain the related baseStats data. If you don't need to use the baseStats data immediately
          // after the creation, you can remove the include statement.
          include: {
            baseStats: true,
          },
        });

        return newPokemon;
      } catch (error) {
        console.error('Error creating Pokemon:', error);
        throw new Error('Failed to create Pokemon');
      }
    },
    catchPokemon: async (_: any, { userId, pokemonId, level }: any) => {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: pokemonId },
        include: { baseStats: true },
      });

      if (!pokemon || !pokemon.baseStats) {
        throw new Error('Pokemon or base stats not found');
      }

      const stats = calculateStatsForLevel(pokemon.baseStats, level);

      return await prisma.userPokemon.create({
        data: {
          user: { connect: { id: userId } },
          pokemon: { connect: { id: pokemonId } },
          status: 'WITH_TRAINER',
          stats: {
            create: stats,
          },
        },
      });
    },
    createMove: async (
      _: any,
      { name, type, category, power, accuracy }: any,
    ) => {
      return await prisma.move.create({
        data: {
          name,
          type,
          category,
          power,
          accuracy,
        },
      });
    },
    assignMoveToPokemon: async (_: any, { pokemonId, moveId }: any) => {
      return await prisma.move.update({
        where: { id: moveId },
        data: { pokemon: { connect: { id: pokemonId } } },
      });
    },
    generateWildPokemon: async (_: any, { pokemonId, level }: any) => {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: pokemonId },
        include: { baseStats: true },
      });

      if (!pokemon || !pokemon.baseStats) {
        throw new Error('Pokemon or base stats not found');
      }

      const stats = calculateStatsForLevel(pokemon.baseStats, level);

      return await prisma.wildPokemon.create({
        data: {
          pokemon: { connect: { id: pokemonId } },
          stats: {
            create: stats,
          },
        },
      });
    },
    updateUserPokemonStatus: async (_: any, { userPokemonId, status }: any) => {
      return await prisma.userPokemon.update({
        where: { id: userPokemonId },
        data: { status },
      });
    },
    // createSprite: async (_: any, { pokemonId, file, description, context }: any) => {
    createSprite: async (
      _: any,
      { pokemonId, url, description, context }: any,
    ) => {
      // const url = await uploadSpriteToFirebase(file);
      return await prisma.sprite.create({
        data: {
          url,
          description,
          context,
          pokemon: { connect: { id: pokemonId } },
        },
      });
    },
  },
};
