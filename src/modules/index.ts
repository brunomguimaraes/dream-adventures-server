import { userResolvers } from "@modules/user/user.resolvers";
import { pokemonResolvers } from "@modules/pokemon/pokemon.resolvers";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...pokemonResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...pokemonResolvers.Mutation,
  },
};
