import { gql } from 'apollo-server';
import { userTypeDefs } from '@modules/user/user.typeDefs';
import { pokemonTypeDefs } from '@modules/pokemon/pokemon.typeDefs';

export const typeDefs = gql`
  ${userTypeDefs}
  ${pokemonTypeDefs}
`;

