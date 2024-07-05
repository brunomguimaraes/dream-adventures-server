import { gql } from 'apollo-server';

export const pokemonTypeDefs = gql`
  type Pokemon {
    id: ID!
    name: String!
    type: String!
  }

  type UserPokemon {
    id: ID!
    user: User!
    pokemon: Pokemon!
  }

  type Query {
    pokemons: [Pokemon!]!
    userPokemons(userId: Int!): [UserPokemon!]!
  }

  type Mutation {
    createPokemon(name: String!, type: String!): Pokemon!
    catchPokemon(userId: Int!, pokemonId: Int!): UserPokemon!
  }
`;
