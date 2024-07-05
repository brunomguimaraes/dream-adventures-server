import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    pokemons: [Pokemon!]!
  }

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
    users: [User!]!
    pokemons: [Pokemon!]!
    userPokemons(userId: Int!): [UserPokemon!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    createPokemon(name: String!, type: String!): Pokemon!
    catchPokemon(userId: Int!, pokemonId: Int!): UserPokemon!
  }
`;
