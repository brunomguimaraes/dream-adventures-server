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
    id: ID!
    phyAtk: Int!
    eleAtk: Int!
    eneAtk: Int!
    adaAtk: Int!
    phyDef: Int!
    eleDef: Int!
    eneDef: Int!
    adaDef: Int!
    spd: Int!
    hp: Int!
    mor: Int!
    aff: Int!
    foc: Int!
    aur: Int!
    inst: Int!
    syn: Int!
    critRate: Int!
    critMult: Float!
    elemMult: Float!
    acc: Int!
    toughness: Int!
    pierce: Int!
  }

  input BaseStatsInput {
    phyAtk: Int!
    eleAtk: Int!
    eneAtk: Int!
    adaAtk: Int!
    phyDef: Int!
    eleDef: Int!
    eneDef: Int!
    adaDef: Int!
    spd: Int!
    hp: Int!
    mor: Int!
    aff: Int!
    foc: Int!
    aur: Int!
    inst: Int!
    syn: Int!
    critRate: Int!
    critMult: Float!
    elemMult: Float!
    acc: Int!
    toughness: Int!
    pierce: Int!
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
    stats: BaseStats!
    status: StorageStatus!
  }

  type WildPokemon {
    id: ID!
    pokemon: Pokemon!
    stats: BaseStats!
  }

  type Sprite {
    id: ID!
    url: String!
    description: String!
    context: String!
    pokemon: Pokemon!
  }

  type Query {
    pokemons: [Pokemon!]!
    userPokemons(userId: Int!): [UserPokemon!]!
    wildPokemons: [WildPokemon!]!
    moves: [Move!]!
  }

  type Mutation {
    createPokemon(
      name: String!
      types: [PokemonType!]!
      catchRate: Float!
      genderRatio: Float!
      baseStats: BaseStatsInput!
    ): Pokemon!
    catchPokemon(userId: Int!, pokemonId: Int!): UserPokemon!
    createMove(
      name: String!
      type: PokemonType!
      category: MoveCategory!
      power: Int!
      accuracy: Float!
    ): Move!
    assignMoveToPokemon(pokemonId: Int!, moveId: Int!): Pokemon!
    generateWildPokemon(pokemonId: Int!, level: Int!): WildPokemon!
    updateUserPokemonStatus(
      userPokemonId: ID!
      status: StorageStatus!
    ): UserPokemon!
    createSprite(
      pokemonId: ID!
      url: String!
      description: String!
      context: String!
    ): Sprite!
  }
`;
