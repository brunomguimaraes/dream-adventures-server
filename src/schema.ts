import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './typesDefs';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
