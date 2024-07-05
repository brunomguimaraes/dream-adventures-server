import { ApolloServer } from 'apollo-server';
import { resolvers } from 'modules';
import { typeDefs } from 'schema';

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
