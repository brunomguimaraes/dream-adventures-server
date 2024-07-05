import { gql } from 'apollo-server';

export const pokemonTypeDefs = gql`
  enum PokemonType {
    NORMAL
    FIRE
    WATER
    ELECTRIC
    GRASS
    ICE
    FIGHTING
    POISON
    GROUND
    FLYING
    PSYCHIC
    BUG
    ROCK
    GHOST
    DRAGON
    DARK
    STEEL
    FAIRY
  }

  enum MoveCategory {
    PHYSICAL
    ELEMENTAL
    ENERGY
    ADAPTABLE
  }

  enum StorageStatus {
    WITH_TRAINER
    IN_POKEBANK
  }

  type BaseStats {
    PHY_ATK: Int!
    ELE_ATK: Int!
    ENE_ATK: Int!
    ADA_ATK: Int!
    PHY_DEF: Int!
    ELE_DEF: Int!
    ENE_DEF: Int!
    ADA_DEF: Int!
    SPD: Int!
    HP: Int!
    MOR: Int!
    AFF: Int!
    FOC: Int!
    AUR: Int!
    INST: Int!
    SYN: Int!
    CRIT_RATE: Int!
    CRIT_MULT: Float!
    ELEM_MULT: Float!
    ACC: Int!
    TOUGHNESS: Int!
    PIERCE: Int!
  }

  type Stats {
    PHY_ATK: Int!
    ELE_ATK: Int!
    ENE_ATK: Int!
    ADA_ATK: Int!
    PHY_DEF: Int!
    ELE_DEF: Int!
    ENE_DEF: Int!
    ADA_DEF: Int!
    SPD: Int!
    HP: Int!
    MOR: Int!
    AFF: Int!
    FOC: Int!
    AUR: Int!
    INST: Int!
    SYN: Int!
    CRIT_RATE: Int!
    CRIT_MULT: Float!
    ELEM_MULT: Float!
    ACC: Int!
    TOUGHNESS: Int!
    PIERCE: Int!
  }

  type Pokemon {
    id: ID!
    name: String!
    types: [PokemonType!]!
    catchRate: Float!
    genderRatio: Float!
    baseStats: BaseStats!
    moves: [Move!]!
  }

  type Move {
    id: ID!
    name: String!
    type: PokemonType!
    category: MoveCategory!
    power: Int!
    accuracy: Float!
  }

  type User {
    id: ID!
    name: String!
  }

  type UserPokemon {
    id: ID!
    user: User!
    pokemon: Pokemon!
    stats: Stats!
    status: StorageStatus!
  }

  type WildPokemon {
    id: ID!
    pokemon: Pokemon!
    stats: Stats!
  }

  type Query {
    pokemons: [Pokemon!]!
    userPokemons(userId: Int!): [UserPokemon!]!
    wildPokemons: [WildPokemon!]!
    moves: [Move!]!
  }

  type Mutation {
    createPokemon(name: String!, types: [PokemonType!]!, catchRate: Float!, genderRatio: Float!, baseStats: BaseStatsInput!): Pokemon!
    catchPokemon(userId: Int!, pokemonId: Int!): UserPokemon!
    createMove(name: String!, type: PokemonType!, category: MoveCategory!, power: Int!, accuracy: Float!): Move!
    assignMoveToPokemon(pokemonId: Int!, moveId: Int!): Pokemon!
    generateWildPokemon(pokemonId: Int!, level: Int!): WildPokemon!
    updateUserPokemonStatus(userPokemonId: ID!, status: StorageStatus!): UserPokemon!
  }

  input BaseStatsInput {
    PHY_ATK: Int!
    ELE_ATK: Int!
    ENE_ATK: Int!
    ADA_ATK: Int!
    PHY_DEF: Int!
    ELE_DEF: Int!
    ENE_DEF: Int!
    ADA_DEF: Int!
    SPD: Int!
    HP: Int!
    MOR: Int!
    AFF: Int!
    FOC: Int!
    AUR: Int!
    INST: Int!
    SYN: Int!
    CRIT_RATE: Int!
    CRIT_MULT: Float!
    ELEM_MULT: Float!
    ACC: Int!
    TOUGHNESS: Int!
    PIERCE: Int!
  }
`;
